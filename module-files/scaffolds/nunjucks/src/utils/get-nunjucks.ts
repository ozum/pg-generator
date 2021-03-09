import { join } from "path";
import { filterFunctions } from "pg-generator";
import nunjucks, { Environment } from "nunjucks";
import * as filters from "./filters";

/**
 * Creates `nunjucks` template engine environment for the given generator and adds filters.
 *
 * @param generatorPath is the path of the generator.
 */
export function getNunjucks(generatorPath: string): Environment {
  // Create `nunjucks` environment.
  const environment = new nunjucks.Environment(
    // Add given sub-generator path and shared "partials" path to the list of template paths.
    new nunjucks.FileSystemLoader([join(generatorPath, "templates"), join(__dirname, "../partials")]),
    { autoescape: false }
  );

  // Add pg-generator and custom filters to nunjucks. Filters are not nunjucks specific, many template engines have a similar mechanism.
  Object.entries({ ...filterFunctions, ...filters }).forEach(([name, filter]) => environment.addFilter(name, filter));
  return environment;
}
