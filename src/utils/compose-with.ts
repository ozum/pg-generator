/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { dirname, join, isAbsolute, resolve, parse, format } from "path";
import { Dirent, promises as fs } from "fs";
import type { Db } from "pg-structure";
import { ignoreCode, ignoreMessage } from "ignor";
import type { GeneratorOptions } from "../types";
import { PgenError } from "./pgen-error";
import { exists } from "./exists";
import type { PgGenerator } from "../pg-generator";

const SPECIAL_DIRS = ["partials", "utils"];
const PREFIX = "pg-generator";

type Class<T = unknown, Arguments extends any[] = any[]> = new (...arguments_: Arguments) => T;

/**
 * If  given id does not have prefix, adds prefix to it.
 *
 * @param id is the id to add prefix.
 * @param prefix is the prefix to add.
 * @returns id with prefix.
 *
 * @example
 * getAlternativeId("example", "pg-generator"); // "pg-generator-example"
 * getAlternativeId("@user/example", "pg-generator"); // "@user/pg-generator-example"
 */
function getAlternativeId(id: string): string | undefined {
  const { dir, name, ext } = parse(id);
  return name.startsWith(PREFIX) ? undefined : format({ dir, name: `${PREFIX}-${name}`, ext });
}

/**
 * Resolves path.
 * - If path is an absolute path, returns it as it is.
 * - If path is a relative path, resolves it relative to cwd.
 * - If path is a bare name (like e module name), returns dir path of the `require.resolve()`.
 *
 * @param id is the path to resolve.
 * @returns resolved absolute path.
 *
 * @example
 * resolveModule("my-module"); // /path/to/project/node_modules/my-module/dist
 * resolveModule("my-module", "pg-generator"); // /path/to/project/node_modules/my-module/dist or /path/to/project/node_modules/pg-generator-my-module/dist
 * resolveModule("/path/to/my-module"); // /path/to/my-module
 * resolveModule("./my-module"); // /path/to/my-module
 */
function resolvePath(id: string): string | undefined {
  let result: string | undefined;
  // Test relative path. Matches "./",  "../",  "..\",  "..\"
  if (/^\.\.?[\\/]/.test(id)) result = resolve(id);
  else if (isAbsolute(id)) result = id;
  else {
    result = ignoreCode("MODULE_NOT_FOUND", () => require.resolve(id));
    const alternativeId = getAlternativeId(id);
    if (result === undefined && alternativeId !== undefined) result = ignoreCode("MODULE_NOT_FOUND", () => require.resolve(alternativeId));
    /* istanbul ignore next */
    return result === undefined ? undefined : dirname(result);
  }
  return result;
}

/**
 * Imports generator from given path. If imported module is not a sub-class of PgGenerator returns undefined.
 *
 * @param path is the path to import generator.
 * @param name is the name of the generator. To import named export instead of default.
 * @returns generator class.
 */
async function importGeneratorFromPath(path: string, name: string): Promise<Class<PgGenerator> | undefined> {
  const GeneratorModule = await import(path).catch(ignoreMessage(/Cannot find module/));
  if (GeneratorModule === undefined) return undefined;
  const Generator = GeneratorModule.default ?? GeneratorModule[name];
  // instanceof PgGenerator is not used, because this PgGenerator may be different than PgGenerator from plugin's dependencies.
  return typeof Generator?.prototype?.generate === "function" ? Generator : undefined;
}

/**
 * Imports given generator or sub-generator from given path.
 *
 * @param path is the path to import generator or sub-generaor.
 * @param generator is the generator to import.
 * @param subGenerator is the sub-generator to import.
 * @returns the generator class and it's path.
 */
export async function importGenerator(
  path: string,
  generator: string,
  subGenerator?: string
): Promise<[Class<PgGenerator> | undefined, string]> {
  const name = subGenerator ?? generator;
  let fullPath = join(path, subGenerator || "");
  let Generator = await importGeneratorFromPath(fullPath, name);

  if (!Generator && !subGenerator) {
    fullPath = join(path, "app");
    Generator = await importGeneratorFromPath(fullPath, name);
  }

  const isDirectory = (await fs.lstat(fullPath).catch(ignoreCode(["ENOENT", "ENOTDIR"])))?.isDirectory();
  if (!isDirectory) fullPath = dirname(fullPath);

  return [Generator, fullPath];
}

/**
 * Reads directories of first available sub-plugin path.
 *
 * @param id is the directory that contains sub-plugin paths.
 * @param subDirs possible sub-plugin paths.
 * @returns first available sub-plugin directory and sub-plugins (directories) in it. If dir is not found, returns undefined. If sub-dirs are not available, returns `[]`.
 *
 * @example
 * await readSubGenerators("my-plugin"); // ["app", "objection"]
 */
export async function readGenerators(id: string): Promise<string[] | undefined> {
  const path = resolvePath(id);
  if (path === undefined || !(await exists(path))) return undefined;

  const entries: Dirent[] = await fs.readdir(path, { withFileTypes: true }).catch(ignoreCode(["ENOTDIR", "ENOENT"], []));
  return entries.filter((entry) => entry.isDirectory() && !SPECIAL_DIRS.includes(entry.name)).map((entry) => entry.name);
}

/**
 * Executes a generator or a sub-generator.
 *
 * @param generator is the generator to execute.
 * @param subGenerator is the name of the sub-generator to execute.
 * @param options are options including internal options.
 * @param cwd is the path of the destination. If the outpur directory is a relative path, it is calculated relative to the cwd.
 * @param db is the [pg-structure Db instance](https://www.pg-structure.com/nav.02.api/classes/db).
 *
 * @throws error if generator can not be found.
 *
 * @example
 * composeWith("generator-from-npm", "sub-generator-name", options, db, cwd);
 * composeWith(require.resolve("./local-generator"), "sub-generator-name", options, db, cwd);
 */
export async function composeWith<O extends GeneratorOptions>(
  generator: string,
  subGenerator: string | undefined,
  options: O,
  db: Db,
  cwd: string
): Promise<void> {
  const path = resolvePath(generator);
  if (path === undefined || !(await exists(path))) throw PgenError.composerError("NOGEN", generator, subGenerator);

  const [Generator, fullPath] = await importGenerator(path, generator, subGenerator);
  if (Generator === undefined) throw PgenError.composerError("NOSUB", generator, subGenerator, await readGenerators(generator));
  const internalOptions = { templateDir: join(fullPath, "templates"), cwd, db };
  return new Generator(options, internalOptions).generate();
}
