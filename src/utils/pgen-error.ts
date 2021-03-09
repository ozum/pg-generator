/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { EOL } from "os";
import { inspect } from "util";
import type { CollisionsByTable } from "pg-structure";

const messages: Record<string, (n: string, s?: string) => string> = {
  NOGEN: (n = "") => `You don't seem to have a generator with the name '${n}' installed.`,
  NOSUB: (n = "", s = "") => `'${n}' doesn't seem to have a sub-generator with the name '${s}'.`,
  NOTAGEN: (n = "", s = "") => `'${n}' exports '${s}' but it is not a sub-generator.`,
  NOEXP: (n = "") => `${n} exists, but does not have any sub-generators.`,
};

type ErrorCode = keyof typeof messages | "RELCOL" | "GENERAL";

export class PgenError extends Error {
  public code: ErrorCode = "GENERAL";
  public readonly type = "PgenError";
  public subGenerators?: string[];

  public static withCode(code: ErrorCode, message: string): PgenError {
    const error = new PgenError(message);
    error.code = code;
    return error;
  }

  public static collisionError(reportObject: CollisionsByTable): PgenError {
    const report = inspect(reportObject, { depth: null });
    const message = `Some relations have same names. Use "optimal" or "descriptive" for "relationNameFunctions" option or proivde your own naming functions.${EOL}${report}`;
    const error = this.withCode("RELCOL", message);
    return error;
  }

  public static composerError(code: ErrorCode, id: string, subGenerator?: string, subGenerators?: string[]): PgenError {
    const message = messages[code](id, subGenerator === "" || subGenerator === undefined ? "index.js or app" : subGenerator);
    const error = this.withCode(code, message);
    error.subGenerators = subGenerators;
    return error;
  }
}
