import { join, basename, extname } from "path";
import { EOL } from "os";
import { promises as fs } from "fs";
import { ignoreCode } from "ignor";
import { PgenError } from "./utils/pgen-error";
import { copyDir } from "./utils";

const SCAFFOLD_DIR = join(__dirname, "../module-files/scaffolds");

/**
 * Renames "name" entry of the "package.json" in given directory.
 *
 * @param dir is the directory that contains the "package.json" file.
 * @param newName is the new name.
 */
async function renameInPackageJson(dir: string, newName: string): Promise<void> {
  const pkgPath = join(dir, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgPath, { encoding: "utf-8" }));
  pkg.name = newName;
  await fs.writeFile(pkgPath, JSON.stringify(pkg, undefined, 2));
}

/**
 * Formats given list of scaffold names.
 *
 * @param scaffolds are the list of the scaffold names.
 * @internal
 */
export function getScaffoldsMessage(scaffolds: string[]): string {
  const available = scaffolds.join(`${EOL}  ● `);
  return `Available scaffolds are:${EOL}  ● ${available}`;
}

/**
 * Read list of scaffolds from disk.
 *
 * @internal
 */
export async function readScaffolds(): Promise<string[]> {
  return (await fs.readdir(SCAFFOLD_DIR, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name);
}

/**
 * Creates a skeleton Node.js project for a generator (pg-generator plugin).
 *
 * @param scaffoldName is the name to create scaffold from.
 * @param options are options
 * @param options.outDir is the output directory to create the project.
 * @param options.name is the name of the created project.
 * @throws error if required scaffold is unavailable or output directory contains files.
 */
export async function scaffold(
  scaffoldName: string,
  { outDir, name = `pg-generator-${basename(outDir, extname(outDir)).replace("pg-generator-", "")}` }: { outDir: string; name?: string }
): Promise<void> {
  const scaffolds = await readScaffolds();
  if (scaffoldName === undefined) throw new PgenError(`SCAFFOLD is required. ${getScaffoldsMessage(scaffolds)}`);
  if (!scaffolds.includes(scaffoldName)) throw new PgenError(`Unknown scaffold "${scaffold}". ${getScaffoldsMessage(scaffolds)}`);

  try {
    const destinationEntries = await fs.readdir(outDir).catch(ignoreCode("ENOENT"));
    if (destinationEntries && destinationEntries.length > 0) throw new PgenError(`Output directory "${outDir}" is not empty.`);
  } catch (error) {
    if (error.code === "ENOTDIR") throw new PgenError(`"${outDir}" is not a directory.`);
    throw error;
  }

  await copyDir(join(SCAFFOLD_DIR, scaffoldName), outDir);
  await renameInPackageJson(outDir, name);
}
