/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { dirname, join, isAbsolute, resolve, parse, format } from "path";
import { promises as fs } from "fs";
import type { Db } from "pg-structure";
import { ignoreCode } from "ignor";
import type { GeneratorOptions } from "../types";
import { PgenError } from "./pgen-error";
import { exists } from "./exists";

const SUBDIRS = ["generators", "dist/generators", "lib/generators", "dist", "lib", "."];
const SPECIAL_DIRS = ["partials", "utils"];

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
function getAlternativeId(id?: string, prefix?: string): string | undefined {
  if (!id || !prefix) return undefined;
  const { dir, name, ext } = parse(id);
  return name.startsWith(prefix) ? undefined : format({ dir, name: `${prefix}-${name}`, ext });
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
 * resolveModule("/path/to/my-module"); // /path/to/my-module
 * resolveModule("./my-module"); // /path/to/my-module
 */
function resolvePath(id?: string, prefix?: string): string | undefined {
  let result: string | undefined;
  if (id === undefined) return undefined;
  const alternativeId = getAlternativeId(id, prefix);
  // Test relative path. Matches "./",  "../",  "..\",  "..\"
  if (/^\.\.?[\\/]/.test(id)) result = resolve(id);
  else if (isAbsolute(id)) result = id;
  else result = ignoreCode("MODULE_NOT_FOUND", () => require.resolve(id));

  if (result === undefined && alternativeId !== undefined) result = ignoreCode("MODULE_NOT_FOUND", () => require.resolve(alternativeId));
  return result !== undefined ? dirname(result) : undefined;
}

/**
 * Reads directories of first available sub-plugin path.
 *
 * @param id is the directory that contains sub-plugin paths.
 * @param subDirs possible sub-plugin paths.
 * @returns first available sub-plugin directory and sub-plugins (directories) in it. If dir is not found, returns undefined. If sub-dirs are not available, returns `[]`.
 *
 * @example
 * // Subdirs : ["geerators", "dist/generators", "lib/generators", "."]
 * await readSubGenerators("my-plugin"); // { path: "/path/to/module", generatorsPath: "dist/generators", generators: ["a", "b"] }
 * await readSubGenerators("/path/to/my-plugin/dist"); // { path: "/path/to/module", generatorsPath: "generators", generators: ["a", "b"] }
 * await readSubGenerators("./path/to/my-plugin/dist/generators"); // { path: "/path/to/module", generatorsPath: ".", generators: ["a", "b"] }
 */
export async function readGenerators(id: string): Promise<{ path: string; generatorsPath: string; generators: string[] } | undefined> {
  const path = await resolvePath(id, "pg-generator");
  if (path === undefined || !(await exists(path))) return undefined;
  for (const generatorsPath of SUBDIRS) {
    const fullPath = join(path, generatorsPath);

    if ((await Promise.all([exists(join(fullPath, "index.js")), exists(join(fullPath, "templates"))])).every((result) => result))
      return { path, generatorsPath, generators: [""] };

    const entries = await fs.readdir(fullPath, { withFileTypes: true }).catch(ignoreCode(["ENOTDIR", "ENOENT"]));
    const generators =
      entries && entries.filter((entry) => entry.isDirectory() && !SPECIAL_DIRS.includes(entry.name)).map((entry) => entry.name);
    if (generators !== undefined) return { path, generatorsPath, generators };
  }

  throw PgenError.composerError("NOEXP", id);
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
  const module = await readGenerators(generator);
  if (module === undefined) throw PgenError.composerError("NOGEN", generator, subGenerator);
  subGenerator = subGenerator ?? module.generators.find((g) => g === "" || g === "app"); // eslint-disable-line no-param-reassign

  if (subGenerator === undefined || !module.generators.includes(subGenerator))
    throw PgenError.composerError("NOSUB", generator, subGenerator, module.generators);

  const generatorPath = join(module.path, module.generatorsPath, subGenerator);
  const GeneratorModule = await import(generatorPath);
  const Generator = GeneratorModule.default ?? GeneratorModule[subGenerator];
  if (!(typeof Generator?.prototype.generate === "function"))
    throw PgenError.composerError("NOTAGEN", generator, subGenerator, module.generators);

  const internalOptions = { templateDir: join(generatorPath, "templates"), cwd, db };
  return new Generator(options, internalOptions).generate();
}
