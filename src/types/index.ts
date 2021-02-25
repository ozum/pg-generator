import type { DbObject, Db, Options as PgStructureOptions } from "pg-structure";
import type { Client, ClientConfig } from "pg"; // eslint-disable-line import/no-unresolved

/** Options for generation and reverse engineering process. Options extends [pg-structure options](https://www.pg-structure.com/nav.02.api/interfaces/options) */
export interface GeneratorOptions {
  /** Whether to clear the destination directory before creating files. */
  clear?: boolean;
  /** Path of the output directory. */
  outDir?: string;
  /** Path to a JSON or JS file providing extra context for templates. */
  contextFile?: string;
  /** Extra context data. This data is merged with and overridden by data from context file. */
  context?: Record<string, any>;
  /** Whether to log output to console. */
  log?: boolean;
}

export interface ClientOptions extends PgStructureOptions {
  /** Either a [node-postgres client](https://node-postgres.com/api/client) or a configuration object or a connection string to create a [node-postgres client](https://node-postgres.com/api/client). */
  client?: Client | ClientConfig | string;

  // ─── PG CLIENT OPTIONS ──────────────────────────────────────────────────────────

  /** Database username. Default from environment var: PGUSER || USER || DB_USER */
  user?: string;
  /** Database password. Default from environment var: PGPASSWORD || DB_PASSWORD */
  password?: string;
  /** Database host. Default from environment var: PGHOST || DB_HOST */
  host?: string;
  /** Database to connect. Default from environment var: PGDATABASE || DB_DATABASE */
  database?: string;
  /** Database port. Default from environment var: PGPORT || DB_PORT */
  port?: string;
  /** Connection string to connect to the database e.g. postgres://user:password@host:5432/database */
  connectionString?: string;
  /** Passed directly to node.TLSSocket, supports all tls.connect options */
  ssl?: any;
}

/** Extended options which includes internal options added by `pg-generator` not by user. */
export interface InternalOptions {
  /** The path of the directory that contains template files. */
  templateDir: string;
  /** The path of the cwd . If outpur directory is a relative path, it is calculated relative to destination root. */
  cwd: string;
  /** [pg-structure Db instance](https://www.pg-structure.com/nav.02.api/classes/db)  */
  db: Db;
}

export type Options = GeneratorOptions & ClientOptions;

/** Context provided to render function. */
export type Context = { o: Db | DbObject; x: Record<string, any> };
