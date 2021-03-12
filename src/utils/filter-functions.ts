/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EOL } from "os";
import { inspect } from "util";
import { Column } from "pg-structure";
import type { DbObject } from "pg-structure";
import wordWrapper from "wordwrap";
import inflection from "inflection";

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
export function clearDefault(input?: string | null): string | undefined {
  // Does not support SQL functions. IMHO it is better to handle sql function default values in RDMS.
  let result: any = input;

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
export function camelCase(input = ""): string {
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
export function pascalCase(input = ""): string {
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
export function classCase(input = ""): string {
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
export function snakeCase(input = ""): string {
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
export function dashCase(input = ""): string {
  return inflection.transform(input, ["underscore", "dasherize"]);
}

/**
 * Converts the given input to the title case.
 *
 * @param input is the input string to convert.
 * @returns string as title case.
 *
 * @example
 * titleCase("user_name"); // User Name
 */
export function titleCase(input = ""): string {
  return inflection.titleize(input);
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
export function singular(input = ""): string {
  return input === "" ? "" : inflection.singularize(input);
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
export function plural(input = ""): string {
  return input === "" ? "" : inflection.pluralize(input);
}

/**
 * Converts text to natural language.
 *
 * @param input is the input string to convert.
 * @param lowFirstLetter is whther to use small letter in first word.
 * @returns string in human readable form.
 *
 * @example
 * human("message_properties"); // "Message properties"
 * human("message_properties", true); // "message properties"
 */
export function human(input = "", lowFirstLetter?: boolean): string {
  return inflection.humanize(snakeCase(input), lowFirstLetter);
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
export function lcFirst(input = ""): string {
  return input === "" ? "" : input[0].toLowerCase() + input.slice(1);
}

/**
 * Converts the given input's first letter to the upper case.
 *
 * @param input is the input string to convert.
 * @returns string with upper first case.
 *
 * @example
 * plural("user_name"); // User_name
 */
export function ucFirst(input = ""): string {
  return input === "" ? "" : input[0].toUpperCase() + input.slice(1);
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
export function quote(input?: string): string {
  return input !== undefined ? JSON.stringify(input) : "";
}

/**
 * Wraps the given string with single quotes.
 *
 * @param input is the input string to wrap with single quotes.
 * @returns string with quotes.
 *
 * @example
 * plural("Some 'example' text"); // 'some \'example\' text'
 */
export function singleQuote(input?: string): string {
  return input !== undefined ? `'${input.replace(/'/g, "\\'")}'` : "";
}

/**
 * Wraps the given string with double quotes.
 *
 * @param input is the input string to wrap with double quotes.
 * @returns string with quotes.
 *
 * @example
 * plural("Some "example" text"); // "some \"example\" text"
 */
export function doubleQuote(input?: string): string {
  return input !== undefined ? `"${input.replace(/"/g, '\\"')}"` : "";
}

/**
 * Vairadic function which strips all of the given strings or database object's names from the start of the source string.
 *
 * @param input is the input string to convert.
 * @param removeList is the list of strings or objects to remove from input.
 * @returns converted string.
 */
export function stripPrefix(input: string | undefined, ...removeList: Array<string | { name: string }>): string {
  if (input === undefined) return "";
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
export function stripSuffix(input: string | undefined, ...removeList: Array<string | { name: string }>): string {
  if (input === undefined) return "";
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
export function strip(input: string | undefined, ...removeList: Array<string | { name: string }>): string {
  if (input === undefined) return "";
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
export function padRight(input = "", totalLength = 20, paddingString = " "): string {
  if (input.length >= totalLength) return input;
  const count = Math.floor((totalLength - input.length) / paddingString.length);
  return input + paddingString.repeat(count);
}

/**
 * Cuts the text after given number of characters.
 *
 * @param input is the text to shorten.
 * @param length is the maximum length allowed.
 * @returns cut text
 *
 * @example
 * maxLength("some example text", 7); // "some ex...";
 */
export function maxLength(input = "", length = 50): string {
  return input.substring(0, length).replace(/\n/g, " ") + (input.length > length ? "..." : "");
}

/**
 * Completes given input's length using with given character (by default space). It may be used to align
 * strings in JSDoc etc.
 *
 * @param input is the input to complete length of.
 * @param length is the length of the finel string.
 * @param char is the character to be used for filling.
 *
 * @example
 * completeWithChar("member", "10"); // "member    "
 * completeWithChar("member", "10", "-"); // "member----"
 */
export function fill(input = "", length = 20, char = " "): string {
  const fillString = char.repeat(Math.max(0, length - input.length));
  return `${input}${fillString}`;
}

/**
 * Wraps given text with start and end characters. By default it wraps with curly braces.
 *
 * @param input is the text to warp.
 * @param start is the starting string.
 * @param end is the ending string.
 * @returns wrapped text.
 *
 * @example
 * wrap("hello"); // "{hello}"
 * wrap("hello", "~"); // "~hello~"
 * wrap("hello", "[]"); // "[hello]"
 */
export function wrap(input?: string, wrapper = "{}"): string {
  if (input === undefined) return "";
  const start = wrapper.length === 1 ? wrapper : wrapper.substring(0, wrapper.length / 2);
  const end = wrapper.length === 1 ? wrapper : wrapper.slice(-(wrapper.length / 2));
  return `${start}${input}${end}`;
}

/**
 * Wraps given text with start and end characters if given condition is truthy.
 * By default it wraps with curly braces.
 *
 * @param input is the text to warp.
 * @param start is the starting string.
 * @param end is the ending string.
 * @param condition is the condition or value to test.
 * @returns wrapped text.
 *
 * @example
 * wrapIf("hello", "x"); // "{hello}"
 * wrapIf("hello", true); // "{hello}"
 * wrapIf("hello", false); // "hello"
 * wrapIf("hello", true, "~"); // "~hello~"
 * wrapIf("hello", true, "[]"); // "[hello]"
 */
export function wrapIf(input: string | undefined, condition: any, wrapper = "{}"): string {
  if (input === undefined) return "";
  return condition ? wrap(input, wrapper) : input;
}

/**
 * Adds given prefix each of the lines of given text.
 *
 * @param input is the input string.
 * @param prefix is the prefix to add each of the lines.
 * @returs the result string.
 *
 * @example
 * linePrefix(`
 * Text line 1
 * Text line 2
 * `, "// ");
 *
 * // Text line 1
 * // Text line 2
 */
export function linePrefix(input = "", prefix: string): string {
  const result = input.replace(new RegExp(`(\n|${EOL})`, "g"), `$1${prefix}`);
  return `${prefix}${result}`;
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
 * @param options are the options.
 * @param options.raw if true, does not add quotes around values.
 * @param options.nullToUndef if true, converts all null values to undefined.
 * @param options.indent is size of the indentation of each level.
 * @returns converted value.
 */
export function stringify(input: any, options: { nullToUndef?: boolean; raw?: boolean; indent?: number } = {}): string {
  const result = options.nullToUndef ? _convertNullToUndef(input) : input;

  if (typeof result !== "object") return JSON.stringify(result, undefined, options.indent) ?? "undefined";

  if (options.raw) {
    return Array.isArray(result)
      ? result.join(", ")
      : Object.entries(result)
          .reduce((reducedResult, [key, value]) => `${reducedResult}${key}: ${value},\n${" ".repeat(options.indent ?? 0)}`, "")
          .replace(/,\n\s*$/, "");
  }

  /* istanbul ignore next */
  return result === undefined || typeof result === "object" ? inspect(result, { depth: null }) : result.toString();
}

/**
 * If given data is a multi line string replaces new lines with escape characters. May be used to prevent JS multi line errors.
 *
 * @param input is the input to convert.
 * @returns the string with escape characters.
 */
export function singleLine(input = ""): string {
  return input.replace(/\r\n/g, "\\r\\n").replace(/\n/g, "\\n");
}

/**
 * Returns given array with unique elements by eliminating duplicate values.
 *
 * @param input is the input array to eliminate duplicates from.
 * @returns the array with unique values.
 */
export function uniqueArray<T extends any>(input?: T[]): T[] {
  return [...new Set(input)];
}

/**
 * Returns an attribute of each objects as a CSV (comma separated values)
 *
 * @param objects are the array of objects to get attribute of.
 * @param attribute is the attribute to get for each object.
 * @param options are the options.
 * @param options.quote is whether to add quotes around attributes.
 * @param options.join is the character to join list.
 * @param options.wrap is the characters to wrap the list if length is greater than 1.
 * @returns the list as a string.
 *
 * @example
 * const objects = [{ name: "a" }, { name: "b" }, { name: "c" }]
 *
 * listAttribute(objects, "name"); // a, b, c
 * listAttribute(objects, "name", { quote: "json" }); // "a", "b", "c"
 * listAttribute(objects, "name", { quote: "single" }); // 'a', 'b', 'c'
 * listAttribute(objects, "name", { quote: "json", wrap: "[]" }); // ["a", "b", "c"]
 * listAttribute(objects, "name", { quote: "json", wrap: "[]" }); // "a"
 */
export function listAttribute<T extends any>(
  objects: T[],
  attribute: keyof T = "name" as any,
  options: { quote?: "single" | "double" | "json"; join?: string; wrap?: string } = {}
): string {
  const quoters: Record<string, any> = { single: singleQuote, double: doubleQuote, json: JSON.stringify };
  const quoter = quoters[options.quote as string];
  const list = objects.map((o) => (quoter ? quoter(o[attribute] as any) : o[attribute])).join(options.join ?? ", ");
  return options.wrap ? wrapIf(list, objects.length > 1, options.wrap) : list;
}

/**
 * Word wraps given text.
 *
 * @param input is the text to word wrap.
 * @param startOrStop is the start or the stop position of each line. (The stop position if this is single option.)
 * @param stop is the stop position of each line.
 * @return word wrapped text.
 *
 * @example
 * wordWrap("The quick fox", 10); // "The quick\nfox"
 * wordWrap("The quick fox", 2, 10); // "  The quick\n  fox"
 */
export function wordWrap(input?: string, startOrStop = 80, stop?: number): string {
  if (input === undefined) return "";
  return wordWrapper(startOrStop, stop as any)(input);
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
export function dboClassName(object?: DbObject, schema = false): string {
  if (object === undefined) return "";
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
export function dboColumnTypeModifier(column?: Column): string {
  if (column === undefined) return "";
  if (column.length !== undefined) return `(${column.length})`;
  const result = [];
  if (column.precision !== undefined) result.push(column.precision);
  if (column.scale !== undefined) result.push(column.scale);
  return result.length > 0 ? `(${result.join(", ")})` : "";
}
