/* eslint-disable import/export */
import { Db, DbObject } from "pg-structure";
import merge from "lodash.merge";
import { camelCase, plural } from "./filter-functions";
import { Context } from "../types/index";

/**
 * Adds extra data to context. More spesific data overrides generic one:
 *
 * - Adds global data. (Key: `global`).
 * - Adds global data of type. (e.g. `typeGlobal.tables`, `typeGlobal.schemas` etc.)
 * - Adds related data of the database object. (e.g. `tables."public.member"`, `schemas.public` etc.)
 *
 * @param dbObject is the context data.
 * @param extra is the extra context data.
 * @returns combined data.
 *
 * @example
 * const context = { name: "member", columns: [] }; // context: Table
 * const extraContext = {
 *   "global": { a: 1 },
 *   "typeGlobal": { tables: { b: 2, skip: false } } ,
 *   "tables": { "public.member": { skip: true } }
 * };
 * augmentContext(context, extraContext); // { name: "member", columns: [], extra: { a:1, b:2, skip: true } }
 */
export function augmentContext(dbObject: Db | DbObject, extra: Record<string, any>): Context {
  const type = plural(camelCase(dbObject.constructor.name)); // e.g. tables
  const name = dbObject instanceof Db ? dbObject.name : (dbObject as DbObject).fullName;
  // return { o: dbObject, x: { ...extra?.global, ...extra?.typeGlobal?.[type], ...extra?.[type]?.[name] } };
  return { o: dbObject, x: merge(extra?.global, extra?.typeGlobal?.[type], extra?.[type]?.[name]) };
}
