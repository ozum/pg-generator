import { relative, basename } from "path";
import { fdir as Fdir } from "fdir";
import junk from "junk";

/**
 * Scans the template directory recursively and gets all template file paths.
 *
 * @param templateRoot is the root directory of the templates.
 * @returns all template files.
 */
export async function getTemplatePaths(templateRoot: string): Promise<string[]> {
  const pathsWithBase = (await new Fdir()
    .exclude((dirname) => ["files", "partials"].includes(dirname))
    .withBasePath()
    .crawl(templateRoot)
    .withPromise()) as string[];

  // Convert to relative paths and filter junk files such as `.DS_Store` and `Thumbs.db`
  return pathsWithBase.map((path) => relative(templateRoot, path)).filter((path) => junk.not(basename(path)));
}
