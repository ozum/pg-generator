import pgStructure, { Db } from "pg-structure";
import type { Client, ClientConfig } from "pg"; // eslint-disable-line import/no-unresolved
import type { ClientOptions } from "../types";

/**
 * Gets `node-postgres` client, client config or connection string based on the options. If none of them
 * is possible with given options, returns `undefined`.
 *
 * @param options are the options.
 * @returns `node-postgres` client, client config or connection string.
 */
function getClient(options: ClientOptions): Client | ClientConfig | string | undefined {
  if (options.client) return options.client;

  const keys = ["user", "password", "host", "database", "password", "host", "database", "port", "connectionString", "ssl"];
  const config: Record<string, any> = {};
  (keys as Array<keyof ClientOptions>).filter((key) => options[key] !== undefined).forEach((key) => (config[key] = options[key])); // eslint-disable-line no-return-assign

  return Object.keys(config).length > 0 ? config : undefined;
}

export async function getDb(options: ClientOptions): Promise<Db> {
  const client = getClient(options);
  const db = await pgStructure(client, options);
  return db;
}
