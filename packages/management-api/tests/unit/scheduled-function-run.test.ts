import { expect, test } from "bun:test";
import {
  boundedScheduledRunError,
  nextScheduledRetryDelaySeconds,
  scheduledRunMinute,
} from "../../src/services/scheduled-function-run.service";

test("scheduled run identity is the UTC minute bucket", () => {
  expect(scheduledRunMinute(new Date("2026-10-01T00:00:59.999Z")).toISOString())
    .toBe("2026-10-01T00:00:00.000Z");
  expect(scheduledRunMinute(new Date("2026-10-01T00:01:00.000Z")).toISOString())
    .toBe("2026-10-01T00:01:00.000Z");
});

test("retry delays are bounded and stable", () => {
  expect([1, 2, 3, 4, 99].map(nextScheduledRetryDelaySeconds)).toEqual([60, 300, 1800, 1800, 1800]);
});

test("run errors are bounded before persistence", () => {
  const value = boundedScheduledRunError(new Error("x".repeat(5_000)));
  expect(new TextEncoder().encode(value).byteLength).toBeLessThanOrEqual(2_048);
  expect(boundedScheduledRunError("short")).toBe("short");
});
