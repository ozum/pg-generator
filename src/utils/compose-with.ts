/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { dirname, join, isAbsolute, resolve, parse, format } from "path";
import { promises as fs } from "fs";
import type { Db } from "pg-structure";
import { ignoreCode } from "ignor";
import type { GeneratorOptions } from "../types";
import { PgenError } from "./pgen-error";

const SUBDIRS = ["generators", "dist/generators", "lib/generators", "dist", "lib", "."];

/**
 * Checks whether given path exists.
 *
 * @param path is tha path to check.
 * @returns existence of the path.
 */
async function exists(path?: string): Promise<boolean> {
  if (path === undefined) return false;
  return (await fs.lstat(path).catch(ignoreCode("ENOENT"))) !== undefined;
}

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
  if (id === undefined) return undefined;
  if (/^\.\.?[\\/]/.test(id)) return resolve(id); // Test relative path. Matches "./",  "../",  "..\",  "..\"
  if (isAbsolute(id)) return id;

  const alternativeId = getAlternativeId(id, prefix);
  let result = ignoreCode("MODULE_NOT_FOUND", () => require.resolve(id));
  if (result === undefined && alternativeId !== undefined) result = ignoreCode("MODULE_NOT_FOUND", () => require.resolve(alternativeId));
  return result !== undefined ? dirname(result) : undefined;
}

/**
 * Gets absolute path of a module. If module is an npm package returns it's root directory (not path of the file written in `package.main`).
 * If module name is given without a prefix, also searches for prefixed module name.
 *
 * @param moduleName is the module to get path of.
 * @param prefix is the string added at the beginning of the module name.
 * @return path of the module.
 *
 * @throws error if module cannot be found.
 *
 * @example
 * getModulePath("my-module", "pg-generator-"); // Tries to get `pg-generator-my-module`. If it is not available, tries to get `my-module`.
 */
// async function getModulePath(id: string, prefix?: string): Promise<string> {
//   const path = resolvePath(id);
//   if (await exists(path)) return path as string;
//   const { root, dir, name, ext } = parse(id);

//   if (prefix && !name.startsWith(prefix)) {
//     const alternativeId = format({ root, dir, name: `${prefix}-${name}`, ext });
//     const alternativePath = resolvePath(alternativeId);
//     if (await exists(alternativePath)) return alternativePath as string;
//     console.log(path, alternativePath);
//   }

//   throw new Error(`Cannot find generator: '${id}'`);
// }

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
    const generators = entries && entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    if (generators !== undefined) return { path, generatorsPath, generators };
  }

  throw new PgenError("NOEXP", id);
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
  if (module === undefined) throw new PgenError("NOGEN", generator, subGenerator);

  subGenerator = subGenerator ?? module.generators.find((g) => g === "" || g === "app"); // eslint-disable-line no-param-reassign

  if (subGenerator === undefined || !module.generators.includes(subGenerator))
    throw new PgenError("NOSUB", generator, subGenerator, module.generators);

  const generatorPath = join(module.path, module.generatorsPath, subGenerator);
  const GeneratorModule = await import(generatorPath);
  const Generator = GeneratorModule.default ?? GeneratorModule[subGenerator];

  if (!(typeof Generator?.prototype.generate === "function")) throw new PgenError("NOTAGEN", generator, subGenerator, module.generators);

  const internalOptions = { templateDir: join(generatorPath, "templates"), cwd, db };

  return new Generator(options, internalOptions).generate();
}
