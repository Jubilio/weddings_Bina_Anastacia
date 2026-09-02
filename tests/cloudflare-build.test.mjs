import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

test("emits exactly one D1 binding named DB", async () => {
  const configPath = path.join(root, "dist/server/wrangler.json");
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const bindings = config.d1_databases ?? [];

  assert.equal(bindings.length, 1);
  assert.equal(bindings[0].binding, "DB");
  assert.equal(bindings[0].database_name, "casamento-bina-anastacia-db");
  assert.equal(new Set(bindings.map((binding) => binding.binding)).size, bindings.length);
});

test("packages the invitation and RSVP database migration", async () => {
  const migrationDirectory = path.join(root, "dist/.openai/drizzle");
  const migrationNames = (await readdir(migrationDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();
  const sql = (
    await Promise.all(
      migrationNames.map((name) => readFile(path.join(migrationDirectory, name), "utf8")),
    )
  ).join("\n");

  assert.match(sql, /CREATE TABLE `invitations`/);
  assert.match(sql, /CREATE TABLE `invitees`/);
  assert.match(sql, /CREATE TABLE `gift_reservations`/);
  assert.match(sql, /gift_reservations_gift_key_unique/);
  assert.match(sql, /CREATE TABLE `security_rate_limits`/);
  assert.match(sql, /ADD `checked_in_at` integer/);
});

test("applies D1 migrations before deploying", async () => {
  const packageJson = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  );
  const deploy = packageJson.scripts["deploy:cloudflare"];

  assert.match(deploy, /d1 migrations apply/);
  assert.ok(deploy.indexOf("d1 migrations apply") < deploy.lastIndexOf("wrangler deploy"));
});
