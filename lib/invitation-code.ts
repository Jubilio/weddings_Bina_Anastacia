export type InvitedPair = readonly [string, string];

function cleanName(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function encodeInvitationCode(names: InvitedPair) {
  const payload = JSON.stringify({ version: 1, names });
  const bytes = new TextEncoder().encode(payload);
  let binary = "";

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/g, "");
}

export function decodeInvitationCode(code?: string): InvitedPair | null {
  if (!code || code.length > 900 || !/^[A-Za-z0-9_-]+$/.test(code)) return null;

  try {
    const padded = code.replaceAll("-", "+").replaceAll("_", "/").padEnd(
      Math.ceil(code.length / 4) * 4,
      "=",
    );
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as {
      version?: unknown;
      names?: unknown;
    };

    if (payload.version !== 1 || !Array.isArray(payload.names) || payload.names.length !== 2) {
      return null;
    }

    const names = payload.names.map(cleanName);
    if (names.some((name) => name.length < 2 || name.length > 120)) return null;

    return [names[0], names[1]];
  } catch {
    return null;
  }
}
