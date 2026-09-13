import assert from "node:assert/strict"; import test from "node:test";
import {
  blocksEmailChangeRequest,
  deriveEmailChangePublicState,
  readOwnEmailChangeSessionState,
} from "./emailChangeState.ts";
test("email change state is fail closed", () => {
  for (const status of ["requesting", "confirmation_pending", "status_unknown", "canonical_changed", "manual_review"]) assert.equal(blocksEmailChangeRequest(status), true);
  assert.equal(deriveEmailChangePublicState("canonical_changed", null), "canonical_completed_reauth_required");
  assert.deepEqual(readOwnEmailChangeSessionState([]), {
    status: null,
    generation: null,
    requiresReauthentication: false,
    preProviderRecoveryAvailable: false,
  });
  assert.deepEqual(readOwnEmailChangeSessionState([{
    status: "completed",
    generation: 4,
    requires_reauthentication: true,
    pre_provider_recovery_available: false,
  }]), {
    status: "completed",
    generation: 4,
    requiresReauthentication: true,
    preProviderRecoveryAvailable: false,
  });
  assert.deepEqual(readOwnEmailChangeSessionState([{
    status: "requesting",
    generation: 5,
    requires_reauthentication: true,
    pre_provider_recovery_available: true,
  }]), {
    status: "requesting",
    generation: 5,
    requiresReauthentication: true,
    preProviderRecoveryAvailable: true,
  });
  for (const malformed of [
    null,
    [{}],
    [{ status: "completed", generation: 4 }],
    [{ status: "completed", generation: 4, requires_reauthentication: false }],
    [{ status: "completed", generation: 0, requires_reauthentication: false, pre_provider_recovery_available: false }],
    [{ status: "unexpected", generation: 4, requires_reauthentication: false, pre_provider_recovery_available: false }],
    [{ status: "requesting", generation: 4, requires_reauthentication: true, pre_provider_recovery_available: 1 }],
  ]) {
    assert.equal(readOwnEmailChangeSessionState(malformed), null);
  }
});

test("multi-row own-state responses fail closed without granting recovery or clearing reauthentication", () => {
  const recoveryAvailable = {
    status: "requesting",
    generation: 5,
    requires_reauthentication: false,
    pre_provider_recovery_available: true,
  };
  const reauthenticationRequired = {
    status: "confirmation_pending",
    generation: 6,
    requires_reauthentication: true,
    pre_provider_recovery_available: false,
  };

  assert.equal(
    readOwnEmailChangeSessionState([recoveryAvailable, reauthenticationRequired]),
    null
  );
  assert.equal(
    readOwnEmailChangeSessionState([reauthenticationRequired, recoveryAvailable]),
    null
  );
  assert.equal(readOwnEmailChangeSessionState([recoveryAvailable, {}]), null);
});
