import { sep } from "path";
import { Db, Schema } from "pg-structure";
import { classCase, plural, camelCase } from "./filter-functions";

/**
 * Returns the pg-structure class name and the accessor to access all instances of the class in a schema to be used in the context
 * for given template path.
 *
 * @param db is the `pg-structure` `Db` instance.
 * @param templatePath is the template path to get the class name and the accessor.
 * @throws Error if there is no array-returning accessor in the Schema for given path.
 *
 * @example
 * getClassName(db, "table/{name}.js.njk"); // { className: "Table", accessor: "tables" };
 */
export function getClassName(db: Db, templatePath: string): { className: string; accessor: keyof Schema } {
  const sepIndex = templatePath.indexOf(sep);
  const className = classCase(templatePath.substring(0, sepIndex));
  if (className === "Db") return { className: "Db", accessor: "db" };
  const accessor = plural(camelCase(className)) as keyof Schema;
  if (!Array.isArray(db.schemas[0][accessor])) throw new Error(`${className} is not a database object type: ${templatePath}`);
  return { className, accessor };
}
