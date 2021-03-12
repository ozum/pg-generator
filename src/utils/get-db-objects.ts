import { DbObject, Db, Schema } from "pg-structure";
import { PgenError } from "./pgen-error";

const isSchemaAttribute = (db: Db, accessor: any): accessor is keyof Schema => Array.isArray(db.schemas[0][accessor as keyof Schema]);
const isDbAttribute = (db: Db, accessor: any): accessor is keyof Db => Array.isArray(db[accessor as keyof Db]);

/**
 * Gets all database objects from all schemas to be used as context for the given className and accessor.
 *
 * @param db is the `pg-structure` `Db` instance.
 * @param className is the pg-structure class name to return instances of.
 * @param accessor is the pg-structure accessor name to access database objects collection.
 * @param templatePath is the template path to get database objects for.
 *
 * @example
 * getDbObjects(db, "table", "tables", "x/y/[table]{name}.js.njk"); // Table[];
 */
export function getDbObjects(db: Db, className: string, accessor: string, templatePath: string): Array<Db | DbObject> {
  if (className === "Db") return [db];
  if (isSchemaAttribute(db, accessor)) return db.schemas.flatMap((schema) => schema[accessor] as DbObject[]);
  if (isDbAttribute(db, accessor)) return db[accessor] as DbObject[];
  throw new PgenError(`'${className}' is not a known database object type: ${templatePath}`);
}
