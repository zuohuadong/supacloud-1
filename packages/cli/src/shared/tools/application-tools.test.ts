import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  applicationReleaseId, parseApplicationReleaseTransferPlan, parseApplicationReleaseTransferResult,
  type ApplicationReleaseRecord, type ApplicationReleaseTransferPlan, type ApplicationReleaseTransferResult,
} from "@supacloud/delivery";
import { authorizeExecution, executionMode, validateExecutionPolicyCoverage } from "../execution-policy";
import { resolveSupaCloudContext } from "../context";
import type { HttpTransport } from "../transports/http";
import { HttpTransport as RealHttpTransport } from "../transports/http";
import { APPLICATION_TOOL_SCHEMA, registerApplicationTools } from "./application-tools";
import { parseToolArguments } from "../schema";
import type { ReleaseControlToolResponse } from "./release-control-response";
import { runAppTool } from "./app-tools";
import { fileURLToPath } from "node:url";
import { createServer, type Socket } from "node:net";
import type { ToolInvocation } from "../tool-server";

function record(manifest = "a".repeat(64), projectRef = "project"): ApplicationReleaseRecord {
  return {
    schema: "supacloud.application-release.v1",
    project_ref: projectRef, application_id: "reviews",
    release_id: applicationReleaseId(projectRef, "reviews", manifest),
    manifest_sha256: manifest, created_at: "2026-09-26T00:00:00.000Z",
    targets: [{ name: "api", object_id: "c".repeat(64), kind: "http", entrypoint: "bundle/index.js" }],
  };
}

function transferPlan(source: ApplicationReleaseRecord, targetRef = "production"): ApplicationReleaseTransferPlan {
  return {
    schema: "supacloud.application-release-transfer-plan.v1",
    project_ref: targetRef, application_id: source.application_id,
    source: {
      project_ref: source.project_ref, release_id: source.release_id, manifest_sha256: source.manifest_sha256,
    },
    candidate_release_id: applicationReleaseId(targetRef, source.application_id, source.manifest_sha256),
    action: "materialize", execution_performed: false,
  };
}

function tool(data: unknown, overrides: Partial<HttpTransport> = {}) {
  let callback: ((args: Record<string, unknown>) => Promise<ReleaseControlToolResponse>) | undefined;
  registerApplicationTools({
    tool(name, _description, schema, handler) {
      validateExecutionPolicyCoverage({ [name]: { schema } });
      callback = handler;
    },
  }, { get: async () => ({ ok: true, status: 200, data }), ...overrides } as unknown as HttpTransport);
  if (!callback) throw new Error("Applications tool missing");
  return callback;
}

test("application schema is covered and a bound release is accepted", async () => {
  const release = record();
  const result = await tool({ project_ref: "project", application_id: "reviews", release })({
    action: "get_release", ref: "project", id: "reviews", release_id: release.release_id,
  });
  expect(JSON.parse(result.content[0]!.text)).toMatchObject({ ok: true, release });
});

test("application logs stay bound to the selected environment", async () => {
  let requested = "";
  const handler = tool({
    project_ref: "project", application_id: "reviews", environment_id: "test",
    release_id: null, activation_id: null, result: [], pagination: { offset: 0, limit: 200, total: 0 },
  }, {
    get: (async (path: string) => {
      requested = path;
      return {
        ok: true, status: 200,
        data: {
          project_ref: "project", application_id: "reviews", environment_id: "test",
          release_id: null, activation_id: null, result: [], pagination: { offset: 0, limit: 200, total: 0 },
        },
      };
    }) as HttpTransport["get"],
  });

  const result = JSON.parse((await handler({
    action: "logs", ref: "project", id: "reviews", environment_id: "test",
    service: "api", search: "failed",
  })).content[0]!.text);

  expect(requested).toBe(
    "/v1/projects/project/applications/reviews/environments/test/logs?service=api&search=failed",
  );
  expect(result).toMatchObject({ ok: true, application_id: "reviews", environment_id: "test" });
});

test("delivery schemas validate through the CLI argument parser after the TypeBox upgrade", () => {
  const args = {
    action: "activate_release" as const, ref: "project", id: "reviews", environment_id: "test",
    activation_id: "01234567-89ab-4def-8123-456789abcdef", release_id: "a".repeat(64),
    configuration_id: "11234567-89ab-4def-8123-456789abcdef", expected_activation_id: "absent",
  };
  expect(parseToolArguments(APPLICATION_TOOL_SCHEMA, args)).toEqual(args);
  for (const change of [
    { id: "../foreign" }, { release_id: "latest" }, { activation_id: "not-a-uuid" },
    { configuration_id: "current" }, { expected_activation_id: "current" }, { extra: true },
  ]) expect(() => parseToolArguments(APPLICATION_TOOL_SCHEMA, { ...args, ...change })).toThrow("Invalid arguments");
});

test("activation and reconciliation post once and validate bound receipts", async () => {
  const identity = {
    project_ref: "project", application_id: "reviews", environment_id: "test",
    release_id: record().release_id, activation_id: "01234567-89ab-4def-8123-456789abcdef",
  };
  for (const action of ["activate_release", "reconcile_activation"]) {
    for (const response of [
      { ok: true, status: 200, data: { ...identity, replayed: true } },
      { ok: true, status: 200, data: { ...identity, activation_id: "11234567-89ab-4def-8123-456789abcdef", replayed: true } },
      { ok: true, status: 200, data: { ...identity, environment_id: "wrong", replayed: true } },
      { ok: true, status: 200, data: {} },
      { ok: false, status: 0, transportError: true },
    ]) {
      let requests = 0;
      const configurationId = "21234567-89ab-4def-8123-456789abcdef";
      const handler = tool(null, { post: (async (url: string, body: unknown, options: unknown) => {
        requests++;
        const path = "/v1/projects/project/applications/reviews/environments/test/activations";
        expect(url).toBe(action === "activate_release" ? path : `${path}/${identity.activation_id}/reconcile`);
        expect(body).toEqual(action === "activate_release" ? {
          release_id: identity.release_id, activation_id: identity.activation_id,
          configuration_id: configurationId, expected_activation_id: null,
        } : {});
        expect(options).toEqual({ timeoutMs: 120_000, maxJsonBytes: 65_536, responseTimeoutMs: 30_000 });
        return response;
      }) as HttpTransport["post"] });
      const output = JSON.parse((await handler({
        action, ref: identity.project_ref, id: identity.application_id,
        environment_id: identity.environment_id, release_id: identity.release_id,
        activation_id: identity.activation_id,
        configuration_id: configurationId, expected_activation_id: "absent",
      })).content[0]!.text);
      expect(requests).toBe(1);
      expect(output).toMatchObject(identity);
      if (response.data && "activation_id" in response.data && response.data.activation_id === identity.activation_id
        && response.data.environment_id === identity.environment_id) expect(output.ok).toBe(true);
      else expect(output.error.code).toBe("OUTCOME_UNKNOWN");
    }
  }
});

test("application mutations reject response-only identity fields before issuing a request", async () => {
  let requests = 0;
  const handler = tool(null, { post: (async () => {
    requests++;
    throw new Error("Unexpected request");
  }) as HttpTransport["post"] });
  for (const action of ["activate_release", "reconcile_activation", "retire_activation"]) {
    const args = {
      action, ref: "project", id: "reviews", environment_id: "test",
      activation_id: "01234567-89ab-4def-8123-456789abcdef",
      ...(action === "retire_activation" ? {} : { release_id: record().release_id }),
      ...(action === "activate_release" ? {
        configuration_id: "21234567-89ab-4def-8123-456789abcdef",
        expected_activation_id: "absent",
      } : {}),
    };
    for (const field of [
      { project_ref: args.ref },
      { application_id: args.id },
    ]) {
      await expect(handler({ ...args, ...field })).rejects.toThrow("Invalid arguments");
    }
  }
  expect(requests).toBe(0);
});

test("activation cannot infer the expected revision or accept mutable release/configuration aliases", async () => {
  let requests = 0;
  const handler = tool(null, { post: (async () => { requests++; throw new Error("Unexpected request"); }) as HttpTransport["post"] });
  const args = {
    action: "activate_release", ref: "project", id: "reviews", environment_id: "test",
    release_id: record().release_id, activation_id: "01234567-89ab-4def-8123-456789abcdef",
    configuration_id: "21234567-89ab-4def-8123-456789abcdef", expected_activation_id: null,
  };
  for (const change of [
    { expected_activation_id: undefined }, { configuration_id: "current" }, { release_id: "latest" }, { activation_id: undefined },
  ]) await expect(handler({ ...args, ...change })).rejects.toThrow();
  expect(requests).toBe(0);
});

test("retirement posts once, binds activation identity and does not require a release alias", async () => {
  const identity = {
    project_ref: "project", application_id: "reviews", environment_id: "test",
    activation_id: "01234567-89ab-4def-8123-456789abcdef",
  };
  for (const response of [
    { ok: true, status: 200, data: { ...identity, retired_at: "2026-09-26T00:00:00.000Z" } },
    { ok: true, status: 200, data: { ...identity, activation_id: "11234567-89ab-4def-8123-456789abcdef", retired_at: "2026-09-26T00:00:00.000Z" } },
    { ok: true, status: 200, data: {} },
    { ok: false, status: 0, transportError: true },
  ]) {
    let requests = 0;
    const handler = tool(null, { post: (async (url: string, body: unknown, options: unknown) => {
      requests++;
      expect(url).toBe(`/v1/projects/project/applications/reviews/environments/test/activations/${identity.activation_id}/retire`);
      expect(body).toEqual({});
      expect(options).toEqual({ timeoutMs: 120_000, maxJsonBytes: 65_536, responseTimeoutMs: 30_000 });
      return response;
    }) as HttpTransport["post"] });
    const output = JSON.parse((await handler({
      action: "retire_activation", ref: identity.project_ref, id: identity.application_id,
      environment_id: identity.environment_id, activation_id: identity.activation_id,
    })).content[0]!.text);
    expect(requests).toBe(1);
    expect(output.activation_id).toBe(identity.activation_id);
    if (response.data && "retired_at" in response.data && response.data.activation_id === identity.activation_id) {
      expect(output.ok).toBe(true);
    } else expect(output.error.code).toBe("OUTCOME_UNKNOWN");
  }
});

test("retirement rejects a release alias before issuing a mutation", async () => {
  let requests = 0;
  const handler = tool(null, { post: (async () => {
    requests++;
    return { ok: true, status: 200, data: {} };
  }) as HttpTransport["post"] });
  await expect(handler({
    action: "retire_activation", ref: "project", id: "reviews",
    environment_id: "test", activation_id: "01234567-89ab-4def-8123-456789abcdef",
    release_id: "a".repeat(64),
  })).rejects.toThrow("release_id is not accepted");
  expect(requests).toBe(0);
});

test("unmounted activation controls report HTTP errors without retry or outcome-unknown recovery", async () => {
  for (const action of ["activate_release", "reconcile_activation", "retire_activation"]) {
    let requests = 0;
    const handler = tool(null, { post: (async () => {
      requests++;
      return { ok: false, status: 404, data: {
        code: "APPLICATION_ROUTE_NOT_FOUND", error: "Application route not found",
      } };
    }) as HttpTransport["post"] });
    const result = await handler({
      action, ref: "project", id: "reviews", environment_id: "test",
      activation_id: "01234567-89ab-4def-8123-456789abcdef",
      ...(action === "retire_activation" ? {} : { release_id: record().release_id }),
      ...(action === "activate_release" ? {
        configuration_id: "21234567-89ab-4def-8123-456789abcdef", expected_activation_id: "absent",
      } : {}),
    });
    expect(requests).toBe(1);
    expect(result.isError).toBe(true);
    expect(JSON.parse(result.content[0]!.text)).toMatchObject({
      ok: false, operation: `applications.${action}`,
      activation_id: "01234567-89ab-4def-8123-456789abcdef",
      error: { code: "HTTP_ERROR", http_status: 404 },
    });
  }
});

function configurationView() {
  return {
    schema: "supacloud.application-configuration.v1", project_ref: "project", application_id: "reviews",
    environment_id: "test", configuration_id: "01234567-89ab-4def-8123-456789abcdef",
    created_at: "2026-09-26T00:00:00.000Z", bun_version: "1.4.2",
    targets: [{ name: "api", kind: "http", hosts: ["reviews.example.test"], environment_names: ["APP_SETTING"] }],
  };
}

test("configuration reads bind both envelope and revision and reject variable values in responses", async () => {
  const configuration = configurationView();
  const envelope = { project_ref: "project", application_id: "reviews", environment_id: "test", configuration };
  const args = { action: "get_configuration", ref: "project", id: "reviews", environment_id: "test" };
  expect(JSON.parse((await tool(envelope)(args)).content[0]!.text)).toMatchObject({ ok: true, configuration });
  expect(JSON.parse((await tool({ ...envelope, configuration: null })(args)).content[0]!.text))
    .toMatchObject({ ok: true, configuration: null });
  for (const value of [
    { ...configuration, environment_id: "wrong" },
    { ...configuration, targets: [{ ...configuration.targets[0], environment: { APP_SETTING: "private-fixture" } }] },
  ]) {
    expect(JSON.parse((await tool({ ...envelope, configuration: value })(args)).content[0]!.text))
      .toMatchObject({ ok: false, error: { code: "INVALID_RESPONSE" } });
  }
  expect(JSON.parse((await tool({ ...envelope, configuration: null })({
    ...args, configuration_id: configuration.configuration_id,
  })).content[0]!.text)).toMatchObject({ ok: false, error: { code: "INVALID_RESPONSE" } });
});

test("configuration writes send the bounded file and retain revision identity on unknown outcomes", async () => {
  const root = await mkdtemp(join(tmpdir(), "configuration-cli-"));
  try {
    const configuration = configurationView();
    const input = {
      configuration_id: configuration.configuration_id, expected_configuration_id: null,
      configuration: { bun_version: "1.4.2", targets: [
        { name: "api", kind: "http", hosts: ["reviews.example.test"], environment: { APP_SETTING: "private-fixture" } },
      ] },
    };
    const path = join(root, "configuration.json");
    await writeFile(path, JSON.stringify(input));
    const args = {
      action: "put_configuration", ref: "project", id: "reviews", environment_id: "test", configuration_path: path,
    };
    for (const response of [
      { ok: true, status: 200, data: { project_ref: "project", application_id: "reviews", environment_id: "test", configuration } },
      { ok: true, status: 200, data: {} },
      { ok: false, status: 0, transportError: true },
    ]) {
      let requests = 0;
      const handler = tool(null, { put: (async (url: string, body: unknown, options: unknown) => {
        requests++;
        expect(url).toBe("/v1/projects/project/applications/reviews/environments/test/configuration");
        expect(body).toEqual(input);
        expect(options).toEqual({ maxJsonBytes: 524_288, responseTimeoutMs: 30_000 });
        return response;
      }) as HttpTransport["put"] });
      const text = (await handler(args)).content[0]!.text;
      expect(requests).toBe(1);
      expect(text).not.toContain("private-fixture");
      const output = JSON.parse(text);
      expect(output.configuration_id).toBe(configuration.configuration_id);
      if (response.data && "configuration" in response.data) expect(output.ok).toBe(true);
      else expect(output.error.code).toBe("OUTCOME_UNKNOWN");
    }
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("application reads reject mismatched receipt identities", async () => {
  const release = record();
  const result = await tool({ project_ref: "project", application_id: "reviews", release })({
    action: "get_release", ref: "project", id: "reviews", release_id: "0".repeat(64),
  });
  expect(JSON.parse(result.content[0]!.text)).toMatchObject({ ok: false, error: { code: "INVALID_RESPONSE" } });
});

test("release transfer plan is read-only and no-op skips the mutation", async () => {
  const source = record(undefined, "staging");
  let posts = 0;
  const plan = { ...transferPlan(source), action: "no-op" as const };
  const handler = tool(plan, {
    postReleaseMutation: (async () => { posts++; throw new Error("Unexpected transfer POST"); }) as HttpTransport["postReleaseMutation"],
  });
  const output = JSON.parse((await handler({
    action: "transfer_release", ref: "production", id: "reviews",
    source_ref: "staging", source_release_id: source.release_id,
  })).content[0]!.text);
  expect(output).toMatchObject({
    ok: true, operation: "applications.transfer_release", no_op: true,
    release_id: plan.candidate_release_id,
  });
  expect(posts).toBe(0);
});

test("release transfer posts once with the planned digest and preserves unknown identity", async () => {
  const source = record(undefined, "staging");
  const plan = transferPlan(source);
  const requests: Array<{ url: string; body: unknown; options: unknown }> = [];
  const result = {
    schema: "supacloud.application-release-transfer-result.v1",
    project_ref: "production", application_id: "reviews", source: plan.source,
    candidate_release_id: plan.candidate_release_id, release: {
      ...source, project_ref: "production",
      release_id: plan.candidate_release_id,
    }, activation_performed: false,
  };
  const handler = tool(plan, {
    postReleaseMutation: (async (url: string, body: unknown, options: unknown) => {
      requests.push({ url, body, options });
      return { ok: true, status: 200, data: result };
    }) as HttpTransport["postReleaseMutation"],
  });
  const output = JSON.parse((await handler({
    action: "transfer_release", ref: "production", id: "reviews",
    source_ref: "staging", source_release_id: source.release_id,
  })).content[0]!.text);
  expect(output).toMatchObject({
    ok: true, operation: "applications.transfer_release",
    release_id: plan.candidate_release_id, transfer: { activation_performed: false },
  });
  expect(requests).toEqual([{
    url: "/v1/projects/production/applications/reviews/release-transfers",
    body: {
      source_ref: "staging", source_release_id: source.release_id,
      expected_manifest_sha256: source.manifest_sha256,
    },
    options: { timeoutMs: 120_000 },
  }]);
});

test("release transfer does not retry an uncertain POST", async () => {
  const source = record(undefined, "staging");
  const plan = transferPlan(source);
  let posts = 0;
  const handler = tool(plan, {
    postReleaseMutation: (async () => {
      posts++;
      return { ok: false, status: 500, transportError: true, data: null };
    }) as HttpTransport["postReleaseMutation"],
  });
  const output = JSON.parse((await handler({
    action: "transfer_release", ref: "production", id: "reviews",
    source_ref: "staging", source_release_id: source.release_id,
  })).content[0]!.text);
  expect(output).toMatchObject({
    ok: false, operation: "applications.transfer_release",
    error: { code: "OUTCOME_UNKNOWN" }, release_id: plan.candidate_release_id,
    manifest_sha256: source.manifest_sha256,
  });
  expect(posts).toBe(1);
});

const transferSource = record(undefined, "staging");
const transferArgs = {
  action: "transfer_release", ref: "production", id: "reviews",
  source_ref: "staging", source_release_id: transferSource.release_id,
};
function transferReceipt(): ApplicationReleaseTransferResult {
  const plan = transferPlan(transferSource);
  return {
    schema: "supacloud.application-release-transfer-result.v1",
    project_ref: "production", application_id: "reviews", source: plan.source,
    candidate_release_id: plan.candidate_release_id,
    release: { ...transferSource, project_ref: "production", release_id: plan.candidate_release_id },
    activation_performed: false,
  };
}

test("shared transfer contracts reject digest substitution and unexpected fields", () => {
  const plan = transferPlan(transferSource), receipt = transferReceipt();
  for (const change of [
    { candidate_release_id: "f".repeat(64) }, { application_id: "other" },
    { source: { ...plan.source, manifest_sha256: "f".repeat(64) } },
    { private: "private-marker" }, { execution_performed: true },
  ]) expect(() => parseApplicationReleaseTransferPlan({ ...plan, ...change })).toThrow();
  for (const change of [
    { candidate_release_id: "f".repeat(64) },
    { release: record() }, { activation_performed: true }, { private: "private-marker" },
  ]) expect(() => parseApplicationReleaseTransferResult({ ...receipt, ...change })).toThrow();
});

test.each(["source_ref", "source_release_id"] as const)("transfer requires a valid %s before HTTP", async field => {
  let requests = 0;
  const handler = tool(null, { get: (async () => {
    requests++; throw new Error("Unexpected request");
  }) as HttpTransport["get"] });
  for (const value of [undefined, "../invalid", ""]) {
    await expect(handler({ ...transferArgs, [field]: value })).rejects.toThrow();
  }
  expect(requests).toBe(0);
});

test.each(["foreign", "digest", "private", "status"] as const)("transfer rejects %s plans without POST", async fault => {
  const plan = transferPlan(transferSource);
  const badPlan = fault === "foreign" ? { ...plan, project_ref: "other",
    candidate_release_id: applicationReleaseId("other", "reviews", transferSource.manifest_sha256) }
    : fault === "digest" ? { ...plan, candidate_release_id: "f".repeat(64) }
    : fault === "private" ? { ...plan, private: "private-marker" } : plan;
  let posts = 0;
  const handler = tool(badPlan, {
    get: (async () => ({ ok: true, status: fault === "status" ? 202 : 200, data: badPlan })) as HttpTransport["get"],
    postReleaseMutation: (async () => { posts++; throw new Error("Unexpected mutation"); }) as HttpTransport["postReleaseMutation"],
  });
  const output = await handler(transferArgs);
  expect(output.isError).toBe(true);
  expect(JSON.parse(output.content[0]!.text)).toMatchObject({ error: { code: "INVALID_RESPONSE" } });
  expect(output.content[0]!.text).not.toContain("private-marker");
  expect(posts).toBe(0);
});

test("app transfer defaults to a concise result and JSON keeps the full receipt", async () => {
  const args = { action: "transfer" as const, id: "reviews", source_ref: "staging", source_release_id: transferSource.release_id };
  const delegate = tool(transferPlan(transferSource), {
    postReleaseMutation: (async () => ({ ok: true, status: 200, data: transferReceipt() })) as HttpTransport["postReleaseMutation"],
  });
  const options = { getApplications: () => delegate, projectRef: "production" };
  const text = (await runAppTool(args, options)).content[0]!.text;
  expect(text).toContain("production/reviews: Artifact transferred");
  expect(text).toContain("Activation: not performed");
  expect(text).toContain(transferReceipt().candidate_release_id);
  expect(text).not.toContain('"schema"');
  const json = (await runAppTool({ ...args, format: "json" }, options)).content[0]!.text;
  expect(JSON.parse(json)).toMatchObject({ ok: true, transfer: transferReceipt(), no_op: false });
  expect(JSON.parse((await runAppTool({ ...args, json: true }, options)).content[0]!.text))
    .toMatchObject({ ok: true, transfer: transferReceipt() });
  await expect(runAppTool({ ...args, json: true, format: "text" }, options)).rejects.toThrow("cannot be combined");
  const noOp = tool({ ...transferPlan(transferSource), action: "no-op" });
  expect((await runAppTool(args, { ...options, getApplications: () => noOp })).content[0]!.text).toContain("No changes");
});

test("production transfer requires target confirmation and read-only profiles permit only planning", () => {
  const context = resolveSupaCloudContext({
    SUPACLOUD_API_URL: "https://management.example.test", SUPACLOUD_API_TOKEN: "synthetic-fixture",
    SUPACLOUD_PROJECT_REF: "production", SUPACLOUD_ENV: "production",
  });
  expect(executionMode("app", "transfer-plan", {})).toBe("read");
  expect(executionMode("applications", "transfer_release", {})).toBe("write");
  expect(() => authorizeExecution("app", { ...transferArgs, action: "transfer" }, { context })).toThrow("confirm-production");
  expect(() => authorizeExecution("app", { ...transferArgs, action: "transfer" }, {
    context, confirmProduction: "production",
  })).not.toThrow();
  const readOnly = { ...context, readOnly: true };
  expect(() => authorizeExecution("app", { ...transferArgs, action: "transfer-plan" }, { context: readOnly })).not.toThrow();
  expect(() => authorizeExecution("app", { ...transferArgs, action: "transfer" }, {
    context: readOnly, confirmProduction: "production",
  })).toThrow("read-only");
  expect(() => authorizeExecution("app", { ...transferArgs, action: "transfer-plan", ref: "foreign" }, { context })).toThrow("cannot target");
});

async function withTransferServer(
  reply: () => Response,
  work: (handler: ToolInvocation, requests: string[]) => Promise<void>,
): Promise<void> {
  const requests: string[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1", port: 0,
    async fetch(request) {
      requests.push(request.method);
      if (request.method === "GET") return Response.json(transferPlan(transferSource));
      expect(new URL(request.url).pathname).toBe("/v1/projects/production/applications/reviews/release-transfers");
      expect(await request.json()).toEqual({
        source_ref: "staging", source_release_id: transferSource.release_id,
        expected_manifest_sha256: transferSource.manifest_sha256,
      });
      return reply();
    },
  });
  let handler: ToolInvocation | undefined;
  registerApplicationTools({ tool(_name, _description, _schema, callback) { handler = callback; } },
    new RealHttpTransport({ baseUrl: `http://127.0.0.1:${server.port}`, token: "synthetic-fixture" }));
  if (!handler) throw new Error("Missing application tool");
  try { await work(handler, requests); } finally { server.stop(true); }
}

test("real HTTP transport accepts one complete transfer without retry", async () => {
  await withTransferServer(() => Response.json(transferReceipt()), async (handler, requests) => {
    const output = await handler(transferArgs);
    expect(JSON.parse(output.content[0]!.text)).toMatchObject({ ok: true, transfer: transferReceipt() });
    expect(requests).toEqual(["GET", "POST"]);
  });
});

test("valid JSON with a truncated HTTP Content-Length remains outcome unknown", async () => {
  const requests: string[] = [];
  const sockets = new Set<Socket>();
  // Bun.serve 会修正 Content-Length；裸响应用于重现网关中断传输。
  const server = createServer(socket => {
    sockets.add(socket);
    socket.once("data", bytes => {
      const method = bytes.toString("ascii").startsWith("GET ") ? "GET" : "POST";
      requests.push(method);
      const body = JSON.stringify(method === "GET" ? transferPlan(transferSource) : transferReceipt());
      const length = Buffer.byteLength(body) + (method === "POST" ? 10 : 0);
      socket.end(`HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: ${length}\r\nConnection: close\r\n\r\n${body}`);
    });
    socket.on("close", () => sockets.delete(socket));
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing loopback address");
  let handler: ToolInvocation | undefined;
  registerApplicationTools({ tool(_name, _description, _schema, callback) { handler = callback; } },
    new RealHttpTransport({ baseUrl: `http://127.0.0.1:${address.port}`, token: "synthetic-fixture" }));
  try {
    if (!handler) throw new Error("Missing application tool");
    const result = await handler(transferArgs);
    expect(JSON.parse(result.content[0]!.text)).toMatchObject({
      ok: false, error: { code: "OUTCOME_UNKNOWN" }, release_id: transferReceipt().candidate_release_id,
    });
    expect(requests).toEqual(["GET", "POST"]);
  } finally {
    for (const socket of sockets) socket.destroy();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

test.each(["incomplete", "oversized", "accepted", "empty", "foreign", "private", "server-error"] as const)(
  "real HTTP transfer reports unknown %s outcomes without reflecting data or retry", async fault => {
    const replies = () => {
      const receipt = transferReceipt();
      if (fault === "incomplete") return new Response(JSON.stringify(receipt).slice(0, -1), {
        headers: { "content-type": "application/json" },
      });
      if (fault === "oversized") return Response.json({ ...receipt, private: "private-marker".repeat(10_000) });
      if (fault === "accepted") return Response.json(receipt, { status: 202 });
      if (fault === "empty") return new Response(null, { status: 204 });
      if (fault === "foreign") return Response.json({ ...receipt, release: record() });
      if (fault === "private") return Response.json({ ...receipt, private: "private-marker" });
      return Response.json({ error: "private-marker" }, { status: 503 });
    };
    await withTransferServer(replies, async (handler, requests) => {
      const output = await handler(transferArgs);
      expect(JSON.parse(output.content[0]!.text)).toMatchObject({
        ok: false, error: { code: "OUTCOME_UNKNOWN" },
        release_id: transferPlan(transferSource).candidate_release_id,
        source_ref: "staging", source_release_id: transferSource.release_id,
      });
      expect(output.content[0]!.text).not.toContain("private-marker");
      expect(requests).toEqual(["GET", "POST"]);
    });
  },
);

test("CLI subprocess plans in read-only production and enforces confirmation before any transfer", async () => {
  const root = await mkdtemp(join(tmpdir(), "transfer-cli-"));
  const requests: string[] = [];
  const server = Bun.serve({
    hostname: "127.0.0.1", port: 0,
    fetch(request) {
      requests.push(request.method);
      return Response.json(request.method === "GET" ? transferPlan(transferSource) : transferReceipt());
    },
  });
  const environment = Object.fromEntries(Object.entries(process.env).filter(
    ([key, value]) => value !== undefined && !/^(SUPACLOUD_|SUPABASE_|X_PROJECT_REF$|MANAGEMENT_API_URL$)/.test(key),
  ));
  const entry = fileURLToPath(new URL("../../index.ts", import.meta.url));
  const run = async (action: string, flags: string[] = []) => {
    const child = Bun.spawn([process.execPath, entry, "--env", "prod", "app", action,
      "--id", "reviews", "--source_ref", "staging", "--source_release_id", transferSource.release_id, ...flags], {
      cwd: root, env: environment, stdout: "pipe", stderr: "pipe",
    });
    const [code, stdout, stderr] = await Promise.all([
      child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
    ]);
    return { code, stdout, stderr };
  };
  const config = (readOnly: boolean) => [
    "SUPACLOUD_ENV=production", "SUPACLOUD_PROJECT_REF=production",
    `SUPACLOUD_API_URL=http://127.0.0.1:${server.port}`, "SUPACLOUD_API_TOKEN=synthetic-fixture",
    `SUPACLOUD_READ_ONLY=${readOnly}`,
  ].join("\n") + "\n";
  try {
    await Bun.write(join(root, ".env.supacloud.prod"), config(true));
    const text = await run("transfer-plan");
    expect(text.code, text.stderr).toBe(0);
    expect(text.stdout).toContain("Transfer required");
    for (const format of [["--json"], ["--format", "json"]]) {
      const json = await run("transfer-plan", format);
      expect(json.code, json.stderr).toBe(0);
      expect(JSON.parse(json.stdout)).toMatchObject({ ok: true, plan: transferPlan(transferSource) });
    }
    const readOnly = await run("transfer", ["--confirm-production", "production"]);
    expect(readOnly.code).toBe(1);
    expect(readOnly.stderr).toContain("read-only");
    const foreign = await run("transfer-plan", ["--ref", "foreign"]);
    expect(foreign.code).toBe(1);
    expect(requests).toEqual(["GET", "GET", "GET"]);
    await Bun.write(join(root, ".env.supacloud.prod"), config(false));
    const unconfirmed = await run("transfer");
    expect(unconfirmed.code).toBe(1);
    expect(unconfirmed.stderr).toContain("confirm-production");
    const confirmed = await run("transfer", ["--confirm-production", "production"]);
    expect(confirmed.code, confirmed.stderr).toBe(0);
    expect(confirmed.stdout).toContain("Artifact transferred");
    expect(requests).toEqual(["GET", "GET", "GET", "GET", "POST"]);
  } finally { server.stop(true); await rm(root, { recursive: true, force: true }); }
}, 30_000);

test("application inventory rejects duplicate, reversed and invalid cursor pages", async () => {
  const releases = [record(), record("b".repeat(64))].sort((a, b) => a.release_id.localeCompare(b.release_id));
  for (const page of [
    { releases: [releases[0], releases[0]], next_cursor: null },
    { releases: [...releases].reverse(), next_cursor: null },
    { releases, next_cursor: releases[0]!.release_id },
    { releases: [releases[0]], next_cursor: releases[0]!.release_id },
  ]) {
    const result = await tool({ project_ref: "project", application_id: "reviews", ...page })({
      action: "list_releases", ref: "project", id: "reviews", limit: 2,
    });
    expect(JSON.parse(result.content[0]!.text)).toMatchObject({ ok: false, error: { code: "INVALID_RESPONSE" } });
  }
});

test("runtime reads preserve a non-ready report and reject a contradictory or foreign report", async () => {
  const activationId = "01234567-89ab-4def-8123-456789abcdef";
  const readiness = {
    project_ref: "project", application_id: "reviews", environment_id: "test",
    release_id: record().release_id, activation_id: activationId, ready: false,
    targets: [{
      target: "api", kind: "http",
      unit: `supacloud-application-project-${activationId}-api.service`,
      pid: 0, invocation_id: null, ready: false, code: "PROCESS_NOT_RUNNING",
    }],
  };
  const envelope = { project_ref: "project", application_id: "reviews", environment_id: "test", readiness };
  const args = { action: "get_runtime", ref: "project", id: "reviews", environment_id: "test" };
  expect(JSON.parse((await tool(envelope)(args)).content[0]!.text)).toMatchObject({
    ok: true, readiness: { ready: false },
  });
  for (const invalid of [{ ...readiness, ready: true }, { ...readiness, environment_id: "other" }]) {
    expect(JSON.parse((await tool({ ...envelope, readiness: invalid })(args)).content[0]!.text))
      .toMatchObject({ ok: false, error: { code: "INVALID_RESPONSE" } });
  }
  expect(JSON.parse((await tool({ ...envelope, readiness: null })(args)).content[0]!.text))
    .toMatchObject({ ok: true, readiness: null });
});

test("deployment evidence reads are scope-bound and preserve incomplete status", async () => {
  const evidence = {
    schema: "supacloud.deployment-evidence.v1",
    status: "unknown",
    recorded_at: "2026-10-04T00:00:00.000Z",
    scope: { project_ref: "project", application_id: "reviews", environment_id: "test" },
    source: { commit_sha: null, manifest_sha256: "a".repeat(64), contract_schema: null, environment_binding_version: null },
    database: {
      provider: "postgresql", version: "18.0", topology: "single-node",
      migration: { status: "confirmed", inventory_sha256: "a".repeat(64), compatibility: "verified" },
      backup: { status: "unknown", latest_success_at: null, freshness_seconds: null },
      recovery: { status: "unknown", drill_id: null, rpo_seconds: null, rto_seconds: null },
    },
    components: [{ name: "management-api", version: "0.90.1", status: "confirmed", health_check: "/health", checked_at: "2026-10-04T00:00:00.000Z" }],
    activation: { release_id: "b".repeat(64), configuration_id: "01234567-89ab-4def-8123-456789abcdef", activation_id: "01234567-89ab-4def-8123-456789abcdef" },
    health: { status: "confirmed", checked_at: "2026-10-04T00:00:00.000Z", authenticated_smoke: "confirmed" },
    rollback: { release_id: null, configuration_id: null, status: "unknown", result: null },
    notes: [],
  };
  const args = { action: "get_deployment_evidence", ref: "project", id: "reviews", environment_id: "test" };
  expect(JSON.parse((await tool({ project_ref: "project", application_id: "reviews", environment_id: "test", evidence })(
    args,
  )).content[0]!.text)).toMatchObject({ ok: true, evidence: { status: "unknown" } });
  expect(JSON.parse((await tool({ project_ref: "project", application_id: "reviews", environment_id: "other", evidence })(
    args,
  )).content[0]!.text)).toMatchObject({ ok: false, error: { code: "INVALID_RESPONSE" } });
});
