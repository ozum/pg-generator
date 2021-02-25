/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { DbObject } from "pg-structure";
import { EOL } from "os";
import { inspect } from "util";
import inflection from "inflection";
import { Column } from "pg-structure";

//
// ──────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S T R I N G   F I L T E R S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────
//

/**
 * Clears the default value of a database object.
 * - Converts two quotes `''` to single quote `'`
 * - Removes quotes at the start and end of string.
 * - Escapes result according to JSON standards.
 *
 * @param input is the default for a database object.
 * @returns default value to be used in a template.
 *
 * @example
 * clearDefaultValue("'No ''value'' given'"); // "No value 'given'"
 */
export function clearDefault(input?: string): string | undefined {
  // Does not support SQL functions. IMHO it is better to handle sql function default values in RDMS.
  let result;

  if (input === null || input === undefined) return undefined;
  if (input === "") result = "";
  else if (input.charAt(0) === "'" || input.charAt(0) === '"') result = input.substring(1, input.length - 1).replace(/''/g, "'");
  else if (!Number.isNaN(+input)) return input;
  else if (input.toLowerCase() === "true") result = true;
  else if (input.toLowerCase() === "false") result = false;
  return JSON.stringify(result);
}

/**
 * Converts the given input to the camel case.
 *
 * @param input is the input string to convert.
 * @returns string as camel case.
 *
 * @example
 * camelCase("user-name"); // userName
 */
export function camelCase(input: string): string {
  return inflection.camelize(input.replace("-", "_"), true);
}

/**
 * Converts the given input to the pascal case.
 *
 * @param input is the input string to convert.
 * @returns string as pascal case.
 *
 * @example
 * pascalCase("user-name"); // UserName
 */
export function pascalCase(input: string): string {
  return inflection.camelize(input.replace("-", "_"), false);
}

/**
 * Converts the given input to the class name.
 *
 * @param input is the input string to convert.
 * @returns string as class case.
 *
 * @example
 * classCase("user-name"); // UserName
 */
export function classCase(input: string): string {
  return inflection.classify(input.replace("-", "_"));
}

/**
 * Converts the given input to the snake case.
 *
 * @param input is the input string to convert.
 * @returns string as snake case.
 *
 * @example
 * snakeCase("userName"); // user_name
 */
export function snakeCase(input: string): string {
  return inflection.underscore(input.replace("-", "_"));
}

/**
 * Converts the given input to the dash case.
 *
 * @param input is the input string to convert.
 * @returns string as dash case.
 *
 * @example
 * dashCase("User Name"); // user-name
 */
export function dashCase(input: string): string {
  return inflection.transform(input, ["underscore", "dasherize"]);
}

/**
 * Converts the given input to the singular form.
 *
 * @param input is the input string to convert.
 * @returns string in singular form.
 *
 * @example
 * singular("user_names"); // user_name
 */
export function singular(input: string): string {
  return inflection.singularize(input);
}

/**
 * Converts the given input to the plural form.
 *
 * @param input is the input string to convert.
 * @returns string in plural form.
 *
 * @example
 * plural("user_name"); // user_names
 */
export function plural(input: string): string {
  return inflection.pluralize(input);
}

/**
 * Converts the given input's first letter to the lower case.
 *
 * @param input is the input string to convert.
 * @returns string with lower first case.
 *
 * @example
 * plural("User_name"); // User_name
 */
export function lcFirst(input: string): string {
  return input[0].toLowerCase() + input.slice(1);
}

/**
 * Wraps the given string with quotes.
 *
 * @param input is the input string to wrap with quotes.
 * @returns string with quotes.
 *
 * @example
 * plural("user_name"); // "user_name"
 */
export function quote(input: string): string {
  return JSON.stringify(input);
}

/**
 * Wraps the given string with single quotes.
 *
 * @param input is the input string to wrap with quotes.
 * @returns string with quotes.
 *
 * @example
 * plural("Some 'example' text"); // 'some \'example\' text'
 */
export function singleQuote(input: string): string {
  return `'${input.replace(/'/g, "\\'")}'`;
}

/**
 * Vairadic function which strips all of the given strings or database object's names from the start of the source string.
 *
 * @param input is the input string to convert.
 * @param removeList is the list of strings or objects to remove from input.
 * @returns converted string.
 */
export function stripPrefix(input: string, ...removeList: Array<string | { name: string }>): string {
  return removeList
    .map((item) => (typeof item === "object" ? item.name : item))
    .reduce((result, item) => result.replace(new RegExp(`^${item}[_\\s-]*`), ""), input);
}

/**
 * Vairadic function which strips all of the given strings or database object's names from the end of the source string.
 *
 * @param input is the input string to convert.
 * @param removeList is the list of strings or objects to remove from input.
 * @returns converted string.
 */
export function stripSuffix(input: string, ...removeList: Array<string | { name: string }>): string {
  return removeList
    .map((item) => (typeof item === "object" ? item.name : item))
    .reduce((result, item) => result.replace(new RegExp(`[_\\s-]*${item}$`), ""), input);
}

/**
 * Vairadic function which strips all of the given strings or database object's names from the source string.
 *
 * @param input is the input string to convert.
 * @param removeList is the list of strings or objects to remove from input.
 * @returns converted string.
 */
export function strip(input: string, ...removeList: Array<string | { name: string }>): string {
  return removeList
    .map((item) => (typeof item === "object" ? item.name : item))
    .reduce((result, item) => result.replace(new RegExp(`${item}[_\\s-]*`), ""), input);
}

/**
 * Pads given string's end with given padding string to complete its length to count.
 *
 * @param input is the input string to convert.
 * @param totalLength is the total length of the result string.
 * @param paddingString is the string to pad with.
 * @returns the string padded with padding string.
 */
export function padRight(input: string, totalLength: number, paddingString = " "): string {
  if (input === undefined || paddingString === undefined || input.length >= totalLength) return input;
  const count = Math.floor((totalLength - input.length) / paddingString.length);
  return input + paddingString.repeat(count);
}

/**
 * Converts given string to JSOC lines by adding "*" at the start of each line.
 *
 * @param input is the input string to convert.
 * @returs the result string.
 *
 * @example
 * makeJsDoc(`
 * Text line 1
 * Text line 2
 * `);
 *
 * // * Text line 1
 * // * Text line 1
 */
export function makeJsDoc(input = ""): string {
  const result = input.replace(new RegExp(`(\n|${EOL})`, "g"), "$1 * ");
  return ` * ${result}`;
}

/**
 * Converts `null` values to `undefined` recursively.
 *
 * @private
 * @param input is the input to convert.
 * @returns null values converted to `undefined`.
 */
function _convertNullToUndef<T extends string | Record<string, any> | any[]>(input: T): T | undefined {
  if (Array.isArray(input)) return (input as any).map((val: any) => _convertNullToUndef(val));
  if (input === null) return undefined;
  if (typeof input === "object") {
    const result = {} as typeof input;
    (Object.keys(input) as Array<keyof typeof input>).forEach((key) => (result[key] = _convertNullToUndef(input[key]) as any)); // eslint-disable-line no-return-assign
    return result;
  }
  return input;
}

/**
 * If given data is object or array, converts it to string.
 * 1. If it has `toString` method uses it. If it returns [object Object] tries other steps.
 * 2. Uses `util.inspect()`;
 *
 * @param input is the input to convert.
 * @param raw if true, does not add quotes around values.
 * @param nullToUndef if true, converts all null values to undefined.
 * @returns converted value.
 */
export function stringify(input: any, options: { nullToUndef?: boolean; raw?: boolean } = {}): string {
  const result = options.nullToUndef ? _convertNullToUndef(input) : input;

  if (typeof result !== "object") return JSON.stringify(result) ?? "undefined";

  if (options.raw) {
    return Array.isArray(result)
      ? result.join(", ")
      : Object.entries(result)
          .reduce((reducedResult, [key, value]) => `${reducedResult}${key}: ${value},\n`, "")
          .replace(/,\n$/, "");
  }

  if (result === undefined || typeof result === "object") return inspect(result, { depth: null });
  return result.toString();
}

/**
 * If given data is a multi line string replcaes new lines with escape characters. May be used to prevent JS multi line errors.
 *
 * @param input is the input to convert.
 * @returns the string with escape characters.
 */
export function singleLine(input: string): string {
  return input.replace(/\r\n/g, "\\r\\n").replace(/\n/g, "\\n");
}

/**
 * Returns given array with unique elements by eliminating duplicate values.
 *
 * @param input is the input array to eliminate duplicates from.
 * @returns the array with unique values.
 */
export function uniqueArray<T extends any>(input: T[]): T[] {
  return [...new Set(input)];
}

//
// ──────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: D A T A B A S E   F I L T E R S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────
//

/**
 * Returns given the given database object name as a class name.
 *
 * @param object is the object to get the name as a class name.
 * @param schema is whether to include schema name.
 */
export function dboClassName(object: DbObject, schema = false): string {
  return classCase(schema ? object.fullName.replace(".", "_") : object.name);
}

/**
 * Returns column length, precision and scale ready to be used in templates.
 *
 * @param column is the column to get details.
 * @returns modifier string.
 *
 * @example
 * columnTypeModifier(price); // (10,4)
 * columnTypeModifier(name); // (20)
 */
export function dboColumnTypeModifier(column: Column): string {
  if (column.length !== undefined) return `(${column.length})`;
  const result = [];
  if (column.precision !== undefined) result.push(column.precision);
  if (column.scale !== undefined) result.push(column.precision);
  return result.length > 0 ? `(${result.join(", ")})` : "";
}
