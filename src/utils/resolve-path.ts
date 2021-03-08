import { extname } from "path";
import type { Db, DbObject } from "pg-structure";
import get from "lodash.get";
import { PgenError } from "./pgen-error";
import * as filterFunctions from "./filter-functions";

type LowerCaseName = string;
type FilterFunction = (...args: any[]) => any;

/** Store all filter functions with lower case keys. */
const LC_FILTER_FUNCTIONS: Record<LowerCaseName, FilterFunction> = {};

// Add functions to object with lower case keys.
Object.entries(filterFunctions).forEach(([name, fn]) => (LC_FILTER_FUNCTIONS[name.toLowerCase()] = fn)); // eslint-disable-line

/**
 * Applies a filter to it's input. Filter name is case insensitive and case-type free.
 *
 * @param input is the input text to appl filter to.
 * @param filterName is the case insensitive filter name.
 * @param templatePath is the path of the template to be reported in error message.
 * @returns filtered text.
 *
 * @example
 * applyFilter("member_option", "camel-case", "template.js.njk");
 * applyFilter("member_option", "camelCase", "template.js.njk");
 * applyFilter("member_option", "cAmElCaSe", "template.js.njk");
 */
function applyFilter(input: string, filterName: string, templatePath: string): string {
  const filterFunction = LC_FILTER_FUNCTIONS[filterFunctions.camelCase(filterName).toLowerCase()];
  if (!filterFunction) throw new PgenError(`There is no '${filterName}' filter: ${templatePath}`);
  return filterFunction(input);
}

/**
 * Applies an array of filters to it's input. Filter names are case insensitive and case-type free.
 *
 * @param input is the input text to appl filter to.
 * @param filterNames are case insensitive filter names.
 * @param templatePath is the path of the template to be reported in error message.
 * @returns filtered text.
 *
 * @example
 * applyFilters("member_option", ["camel-case", "pluralize"], "template.js.njk");
 * applyFilters("member_option", ["camelCase", "pluralize"], "template.js.njk");
 * applyFilters("member_option", ["cAmElCaSe", "pLuRaLiZe"], "template.js.njk");
 */
function applyFilters(input: string, filterNames: string[], templatePath: string): string {
  return filterNames.reduce((current: string, filterName: string) => applyFilter(current, filterName, templatePath), input);
}

/**
 * Resolves variable names and applies filters to the path using given context data.
 *
 * @param path is the path of the template.
 * @param dbObject is the database or database object. e.g. Table, Schema etc.
 * @returns the destination file path.
 *
 * @hidden
 * @example
 * resolvePath("x/y/my-{schema.name}{name#dash-case#plural}.js.njk", table); // x/y/my-public-member-options.js
 */
export function resolvePath(path: string, dbObject: Db | DbObject): string {
  const pattern = /\{\s*(.+?)\s*\}/g; // Match text between curly braces e.g. 'table/{name#dash-case}' captures 'name#dash-case'.

  return path
    .replace(extname(path), "") // remove extension: "{name#dash-case}.js.njk" -> "{name#dash-case}.js"
    .replace(pattern, (_, p) => {
      // resolve variables: "{name#dash-case}.js" -> "member-option.js"
      const [templateVar, ...filterNames] = p.split(/\s*#\s*/);
      const value = get(dbObject, templateVar);
      if (value === undefined || value === null)
        throw new PgenError(`'${templateVar}' cannot be found or is undefined in '${dbObject.constructor.name}'. Path is '${path}'.`);
      return applyFilters(value, filterNames, path);
    });
}
// export function resolvePath(path: string, dbObject: Db | DbObject): string {
//   const pattern = /\{\s*(.+?)\s*\}/g; // Match text between curly braces e.g. 'table/{name#dash-case}' captures 'name#dash-case'.
//   const sepIndex = path.indexOf(sep); // get first '/' position.

//   return path
//     .substring(sepIndex + 1) // remove db object part: "table/{name#dash-case}.js.njk" -> "{name#dash-case}.js.njk"
//     .replace(extname(path), "") // remove extension: "{name#dash-case}.js.njk" -> "{name#dash-case}.js"
//     .replace(pattern, (_, p) => {
//       // resolve variables: "{name#dash-case}.js" -> "member-option.js"
//       const [templateVar, ...filterNames] = p.split(/\s*#\s*/);
//       const value = get(dbObject, templateVar);
//       if (value === undefined || value === null)
//         throw new PgenError(`'${templateVar}' cannot be found or is undefined in '${dbObject.constructor.name}'. Path is '${path}'.`);
//       return applyFilters(value, filterNames, path);
//     });
// }
