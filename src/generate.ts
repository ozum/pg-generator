/* eslint-disable no-nested-ternary */
import type { Options } from "./types";
import { getDb, composeWith } from "./utils";

/**
 * Executes the default sub-generator `app` from a generator.
 *
 * @param generator is the name or path of the generator. If it is a local path, use `require.resolve` or provide an absolute path.
 * @param options are the options for the generator.
 *
 * @example
 * generate("generator-from-npm", options);
 * generate(require.resolve("./local-generator"), options);
 */
export async function generate(generator: string, options?: Options): Promise<void>;
/**
 * Executes a sub-generator from a generator.
 *
 * @param generator is the name or path of the generator. If it is a local path, use `require.resolve` or provide an absolute path.
 * @param subGenerator is the name of the generator.
 * @param options are the new options added on top of curent options.
 *
 * @example
 * generate("generator-from-npm", "sub-generator");
 * generate(require.resolve("./local-generator"), "sub-generator", options);
 */
export async function generate(generator: string, subGenerator?: string, options?: Options): Promise<void>;
export async function generate(generator: string, subOrOptions?: string | Options, maybeOptions?: Options): Promise<void> {
  const options = typeof maybeOptions === "object" ? maybeOptions : typeof subOrOptions === "object" ? subOrOptions : {};
  const generatorName = typeof subOrOptions === "string" ? subOrOptions : undefined;
  const db = await getDb(options);
  return composeWith(generator, generatorName, options, db, process.cwd());
}
