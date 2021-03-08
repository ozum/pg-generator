import { basename, join, dirname } from "path";
import { PgenError } from "./pgen-error";
import { classCase, plural, camelCase } from "./filter-functions";

/**
 * Parses given template path and returns pg-structure class name, accessor name to get collection of instances
 * and target path for the given template path. Allows an optional single space after type.
 *
 * @param templatePath is the template path to get the class name and the accessor.
 * @throws if template path does not contain a class type.
 *
 * @example
 * getClassName("x/y/[table]{name}.js.njk"); // { className: "Table", accessor: "tables", targetPath: "x/y/{name}.js.njk" };
 * getClassName("x/y/[table] {name}.js.njk"); // { className: "Table", accessor: "tables", targetPath: "x/y/{name}.js.njk"  };
 */
export function parseTemplatePath(templatePath: string): { className: string; accessor: string; targetPath: string } {
  // Capture characters between "[]" at the beginning and rest of the string. x/y/[table]{name}.js.njk -> ["[table]", "table", "{name}.js.njk"]
  const found = basename(templatePath).match(/^\[([-\w]+?)\] ?(.+)$/);
  if (!found) throw new PgenError("Template error. Template path does not contain a type.");
  return { className: classCase(found[1]), accessor: plural(camelCase(found[1])), targetPath: join(dirname(templatePath), found[2]) };
}
