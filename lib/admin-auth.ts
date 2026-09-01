import { env } from "cloudflare:workers";

const COOKIE_NAME = "wedding_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function adminPassword() {
  const value = (env as unknown as { ADMIN_PASSWORD?: string }).ADMIN_PASSWORD;
  if (!value) throw new Error("A variável ADMIN_PASSWORD não está configurada.");
  return value;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return bytesToHex(new Uint8Array(digest));
}

async function sign(value: string) {
  const keyMaterial = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`wedding-admin-session:${adminPassword()}`),
  );
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return bytesToHex(new Uint8Array(signature));
}

export async function passwordIsValid(password: string) {
  const [suppliedHash, expectedHash] = await Promise.all([
    sha256(password),
    sha256(adminPassword()),
  ]);
  return constantTimeEqual(suppliedHash, expectedHash);
}

export async function createAdminCookie() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const signature = await sign(String(expires));
  return `${COOKIE_NAME}=${expires}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearAdminCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function isAdminRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (!token) return false;
  const [expiresRaw, suppliedSignature] = token.split(".");
  const expires = Number(expiresRaw);
  if (!expires || !suppliedSignature || expires <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSignature = await sign(expiresRaw);
  return constantTimeEqual(suppliedSignature, expectedSignature);
}
