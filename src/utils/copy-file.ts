import { dirname } from "path";
import { promises as fs } from "fs";

/**
 * Copy the source file to the destination. Also creates the destination directory if it does not exist.
 *
 * @param source is the source file to copy.
 * @param destination is the destination file to be created.
 */
export async function copyFile(source: string, destination: string): Promise<void> {
  await fs.mkdir(dirname(destination), { recursive: true });
  await fs.copyFile(source, destination);
}
