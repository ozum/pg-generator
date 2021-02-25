import { DbObject, Db } from "pg-structure";
import { getClassName } from "./get-class-name";

/**
 * Gets all database objects from all schemas to be used as context for the given template path.
 *
 * @param db is the `pg-structure` `Db` instance.
 * @param templatePath is the template path to get database objects for.
 *
 * @example
 * getDbObjects(db, "table/{name}.js.njk"); // Table[];
 */
export function getDbObjects(db: Db, templatePath: string): Array<Db | DbObject> {
  const { className, accessor } = getClassName(db, templatePath);
  if (className === "Db") return [db];
  return db.schemas.flatMap((schema) => schema[accessor] as DbObject[]);
}
