/* eslint-disable no-console */
import { join } from "path";
import { readFileSync } from "fs";
import meow from "meow";
import getHelp, { commonFlags, chalk, ExtendedAnyFlags } from "meow-helper";

const command = "pgen";
const pkg = JSON.parse(readFileSync(join(__dirname, "../../package.json"), { encoding: "utf8" }));

const args = { "GENERATOR*": "The name or the path of the generator." };

const flags: ExtendedAnyFlags = {
  // Generator Options
  clear: { type: "boolean", desc: "Whether to clear the destination directory before creating files." },
  outDir: { type: "string", desc: "Path of the output directory." },
  contextFile: { type: "string", desc: "Path to a JSON or JS file providing extra context for templates." },
  log: { type: "boolean", default: true, desc: "Whether to log output to console." },
  ...commonFlags,

  // pg-structure options
  commentDataToken: { type: "string", desc: "Tag name to extract JSON data from from database object's comments." },
  envPrefix: { type: "string", default: "DB", desc: "Environment variable prefix to get database client details." },
  excludeSchemas: {
    alias: "e",
    isMultiple: true,
    type: "string",
    desc: "Schema or a pattern similar to SQL's LIKE to select excluded schemas. See examples below.",
  },
  foreignKeyAliasSeparator: { type: "string", desc: "Character to separate source alias" },
  foreignKeyAliasTargetFirst: {
    type: "boolean",
    desc:
      "Whether first part of the foreign key aliases contains target alias (i.e company_employees) or source alias (e.g. employee_company).",
  },
  includeSchemas: {
    alias: "i",
    isMultiple: true,
    type: "string",
    desc: "Schema or a pattern similar to SQL's LIKE to select included schemas. See examples below.",
  },
  includeSystemSchemas: { type: "boolean", desc: "Whether to include PostgreSQL system schemas (e.g. pg_catalog) from database." },
  relationNameFunctions: {
    type: "string",
    desc:
      "Optional module that exports functions to generate names for relationships. 'pg-generator' also provides builtin modules 'short' & 'descriptive'",
  },

  // Client options
  user: { type: "string", desc: "Database username. Default from environment var: PGUSER || USER || DB_USER" },
  password: { type: "string", desc: "Database password. Default from environment var: PGPASSWORD || DB_PASSWORD" },
  host: { type: "string", desc: "Database host. Default from environment var: PGHOST || DB_HOST" },
  database: { type: "string", desc: "Database to connect. Default from environment var: PGDATABASE || DB_DATABASE" },
  port: { type: "string", desc: "Database port. Default from environment var: PGPORT || DB_PORT" },
  connectionString: { type: "string", desc: "Connection string for database e.g. postgres://user:password@host:5432/database" },
  ssl: { type: "string", desc: "Passed directly to node.TLSSocket, supports all tls.connect options." },
};

const groups = {
  clear: {
    title: "General Options",
  },
  commentDataToken: {
    title: "'pg-structure' Options",
    description: "Options send to 'pg-structure'. Please see pg-structure.com for details.",
  },
  user: {
    title: "Client Options",
    description:
      "Options related to database connection. 'pg-generator' supports environment variables and '.env' files. Prefer to use environment variable to protect sensitive data.",
  },
};

const examples = [
  "npm install -g pg-generator-example",
  "",
  "pgen example --outDir models",
  "pgen example:md --outDir models",
  "pgen example --outDir models --contextFile './context.js'",
  "pgen example --outDir models --relationNameFunctions './custom-naming.js'",
  "",
  chalk.dim("Including & Excluding Schemas"),
  "pgen example -i user%",
  "pgen example -i user_meta -i user_main",
  "pgen example -e private%",
  "pgen example -e private_meta -e private_main",
  "",
  chalk.dim("Providing Connection Details"),
  "pgen example --outDir models --user user --password password --database database",
];

export default function getCLI(): meow.Result<typeof flags> {
  const help = getHelp({ lineLength: 140, flags, args, pkg, groups, examples, command });
  return meow(help, { flags, pkg, allowUnknownFlags: false });
}
