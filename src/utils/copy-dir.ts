import { relative, basename, join } from "path";
import { fdir as Fdir } from "fdir";
import junk from "junk";
import { copyFile } from "./copy-file";

export async function copyDir(source: string, destination: string): Promise<void> {
  // Scan template root and filter partials and junk files such as `.DS_Store` and `Thumbs.db`
  const pathsWithBase = (await new Fdir()
    .filter((path) => junk.not(basename(path)))
    .withBasePath()
    .crawl(source)
    .withPromise()) as string[];

  await Promise.all(pathsWithBase.map((path) => copyFile(path, join(destination, relative(source, path)))));
}
