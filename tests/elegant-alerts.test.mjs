import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("uses the invitation-styled toaster globally", async () => {
  const layout = await source("app/layout.tsx");

  assert.match(layout, /<Toaster/);
  assert.match(layout, /wedding-toaster/);
});

test("uses an accessible alert dialog instead of a browser confirmation", async () => {
  const admin = await source("components/guest-admin.tsx");

  assert.match(admin, /<AlertDialogContent className="wedding-alert-dialog">/);
  assert.match(admin, /<AlertDialogTitle>Eliminar este convite\?<\/AlertDialogTitle>/);
  assert.doesNotMatch(admin, /window\.(?:alert|confirm|prompt)\s*\(/);
});

