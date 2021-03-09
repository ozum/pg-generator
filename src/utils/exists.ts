import { promises as fs } from "fs";
import { ignoreCode } from "ignor";

/**
 * Checks whether given path exists.
 *
 * @param path is tha path to check.
 * @returns existence of the path.
 */
export async function exists(path?: string): Promise<boolean> {
  if (path === undefined) return false;
  return (await fs.lstat(path).catch(ignoreCode("ENOENT"))) !== undefined;
}
