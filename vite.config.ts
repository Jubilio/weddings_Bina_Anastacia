import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

if (typeof globalThis.WeakRef === "undefined") {
  class WeakRefShim {
    private value: unknown;

    constructor(value: unknown) {
      this.value = value;
    }

    deref() {
      return this.value;
    }
  }

  globalThis.WeakRef = WeakRefShim as typeof WeakRef;
}

if (typeof globalThis.FinalizationRegistry === "undefined") {
  class FinalizationRegistryShim {
    register() {}
    unregister() {}
  }

  globalThis.FinalizationRegistry = FinalizationRegistryShim as typeof FinalizationRegistry;
}

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

// A configuração de bindings (D1, R2, etc.) é lida automaticamente do wrangler.toml.
// Não é necessário duplicar aqui.

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    optimizeDeps: {
      exclude: ["@cloudflare/unenv-preset/node/process"]
    },
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          compatibility_date: "2024-09-23",
          d1_databases: d1
            ? [
                {
                  binding: d1,
                  database_name: "casamento-bina-anastacia-db",
                  database_id: "ace00c5d-3b3a-4786-89d5-04b6cacb4c2a",
                },
              ]
            : [],
        },
      }),
    ],
  };
});
