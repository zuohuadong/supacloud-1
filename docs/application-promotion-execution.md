# Application Promotion Execution

## Scope

Promotion execution is a durable orchestration over an immutable plan. The
plan remains read-only and is never treated as authorization by itself.

Current implementation provides `ApplicationMigrations.readExecutionPlan` and
`ApplicationMigrations.apply`, not a user-facing promotion executor. The caller
must durably checkpoint the stable backup id before invoking `apply`; this
service does not create a second operation ledger.

For pending project SQL, it holds one database advisory lock from inventory
through backup publication, exact backup readback, migration execution, and
full projected-ledger readback. Backups and per-migration transactions reuse
the held lock. Unsupported/nontransactional SQL and operator provisioning are
blocked; destructive SQL requires the exact execution-plan digest.

The default SQL adapter is shared with the database route: project migration
role, transaction wrappers, ledger lease, schema reload, and session reset
remain unchanged. A batch can partially commit before an error; the service
never retries SQL or restores data. The caller must preserve the durable
unknown outcome and inspect the ledger before deciding recovery.

The scenarios below are the remaining promotion-level acceptance contract.
Operation create/status/reconcile routes, activation orchestration, authenticated
smoke evidence, and CLI commands are not provided by this migration foundation.

Promotion and activation cannot independently claim the same
`application_release` mutation resource. The executor integration must delegate
an owned/fenced resource to child activation, and planner idle checks must permit
only that exact owner. A separate resource key would not provide mutual exclusion
against direct activation. This ownership contract must be implemented before
registering promotion writes.

## Acceptance criteria

```gherkin
Feature: Promote an application between environments

  Scenario: Apply pending project migrations after a verified backup
    Given a fresh plan digest with an idle source and target
    And the target has no migration conflict or operator-provisioning blocker
    When SupaCloud starts promotion with a stable operation id
    Then it records the operation checkpoint before any artifact or database effect
    And it verifies the backup receipt before applying each pending migration
    And it reads the target ledger back before activating the release

  Scenario: Replay a completed promotion
    Given the same operation id has a verified successful mutation receipt
    When the client retries the promotion
    Then SupaCloud performs no transfer, backup, migration, or activation effect
    And returns the original receipt after exact readback

  Scenario: Recover an interrupted promotion
    Given a promotion stopped after an uncertain database or runtime effect
    When the client requests status or reconciliation
    Then SupaCloud reports the last durable phase and outcome as unresolved
    And never blindly replays the uncertain effect

  Scenario: Reject a changed plan
    Given the target ledger, configuration, source release, or active revision changed
    When a promotion is started with the old plan digest
    Then SupaCloud rejects the operation before its first effect

  Scenario: Treat no-op as an observed state
    Given the candidate release, configuration, activation receipt, readiness and fresh
      authenticated smoke all match
    When the plan is read
    Then the action is no-op and promotion creates no mutation
```

Database restore and application release rollback are separate commands. A
release rollback must not silently restore business data.
