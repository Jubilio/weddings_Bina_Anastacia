export function formatInvitationCode(code: string) {
  const normalized = code.replace(/[^a-f0-9]/gi, "").toUpperCase();
  const groups = normalized.match(/.{1,6}/g) ?? [];
  return `BA-${groups.join("-")}`;
}

export function normalizeInvitationCode(value: string) {
  const normalized = value.trim().replace(/^BA-/i, "").replace(/[^a-f0-9]/gi, "").toLowerCase();
  return /^[a-f0-9]{18}$/.test(normalized) ? normalized : null;
}
