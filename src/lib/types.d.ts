import type { D1Database } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  FROM_EMAIL: string;
  RECIPIENT_EMAIL_1: string;
  RECIPIENT_EMAIL_2: string;

  // Secrets
  CF_ACCT_ID?: string;
  CF_API_TOKEN?: string;
  CF_DB_ID?: string;
  JBURSIK_AUTH?: string;
  AUTH_SECRET?: string;
  AUTH_MICROSOFT_ENTRA_ID_ID?: string;
  AUTH_MICROSOFT_ENTRA_ID_SECRET?: string;
  AUTH_MICROSOFT_ENTRA_ID_ISSUER?: string;
  GRAPH_CLIENT_ID?: string;
  GRAPH_CLIENT_SECRET?: string;
  GRAPH_TENANT_ID?: string;
}
