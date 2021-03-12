/* eslint-disable import/export */
import { Db, DbObject } from "pg-structure";
import merge from "lodash.merge";
import { camelCase, plural } from "./filter-functions";
import { Context } from "../types/index";

/**
 * Adds extra data to context. More spesific data overrides generic one:
 *
 * - Adds global data. (Key: `global`).
 * - Adds related data of the database object. (e.g. `tables."public.member"`, `schemas.public` etc.)
 *
 * @param dbObject is the context data.
 * @param extra is the extra context data.
 * @returns combined data.
 *
 * @example
 * const extraContext = {
 *   "global": { a: 1 },
 *   "tables": { "public.member": { skip: true } }
 * };
 * augmentContext(dbObject, extraContext); // { table: { name: "member", columns: [...] }, a:1, skip: true }
 */
export function augmentContext(dbObject: Db | DbObject, extra: Record<string, any>): Context {
  const type = plural(camelCase(dbObject.constructor.name)); // e.g. tables
  const name = dbObject instanceof Db ? dbObject.name : (dbObject as DbObject).fullName;
  const instanceVariable = camelCase(dbObject.constructor.name); // "db", "table", "materializedView"

  // Don't mutate original data within merge. Otherwise if same data file (as module) is used in same application, it will receive mutated data.
  return { o: dbObject, [instanceVariable]: dbObject, ...merge({}, extra.global, extra[type]?.[name]) };
}
