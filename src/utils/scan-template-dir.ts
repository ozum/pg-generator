import { relative, basename, dirname } from "path";
import { fdir as Fdir } from "fdir";
import junk from "junk";

/**
 * Scans the template directory recursively and gets all template file paths.
 *
 * @param templateRoot is the root directory of the templates.
 * @returns all template files and files to copy.
 */
export async function scanTemplateDir(templateRoot: string): Promise<{ templates: string[]; files: string[] }> {
  const filePaths = { templates: [] as string[], files: [] as string[] };

  // Scan template root and filter partials and junk files such as `.DS_Store` and `Thumbs.db`
  const pathsWithBase = (await new Fdir()
    .filter((path) => junk.not(basename(path)) && basename(dirname(path)) !== "partials")
    .withBasePath()
    .crawl(templateRoot)
    .withPromise()) as string[];

  // Group template files and non-template files and convert to relative files.
  pathsWithBase.forEach((path) => {
    const type = basename(path).startsWith("[") ? "templates" : "files";
    filePaths[type].push(relative(templateRoot, path));
  });

  return filePaths;
}
