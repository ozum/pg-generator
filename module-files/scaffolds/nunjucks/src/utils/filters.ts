import type { Table } from "pg-structure";

/**
 * Adds "Hello!"" to the beginning of the string.
 *
 * @param input is the input.
 * @returns the text with "Hello!".
 *
 * @example
 * {{ table.name | hello }}
 */
export function hello(input: string): string {
  return `Hello! ${input}`;
}

/**
 * Returns column names of the table as a CSV list.
 *
 * @param table is the table to get columns of.
 * @returns column names as CSV.
 *
 * @example
 * {{ table | columnNames }}
 */
export function columnNames(table: Table): string {
  return table.columns.map((column) => column.name).join(", ");
}
