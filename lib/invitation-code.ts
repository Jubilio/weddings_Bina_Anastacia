export function formatInvitationCode(code: string) {
  const normalized = code.replace(/[^a-f0-9]/gi, "").toUpperCase();
  const groups = normalized.match(/.{1,6}/g) ?? [];
  return `BA-${groups.join("-")}`;
}
