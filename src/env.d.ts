/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PB_URL: string;
  readonly PUBLIC_WA_PHONE: string;
  readonly PB_ADMIN_EMAIL: string;
  readonly PB_ADMIN_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
