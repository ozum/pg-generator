/* eslint-disable @typescript-eslint/explicit-function-return-type */
type ErrorCode = "NOGEN" | "NOSUB" | "NOTAGEN" | "NOEXP";

const messages: Record<string, (n: string, s?: string) => string> = {
  NOGEN: (n = "") => `You don't seem to have a generator with the name '${n}' installed.`,
  NOSUB: (n = "", s = "") => `'${n}' doesn't seem to have a sub-generator with the name '${s}'.`,
  NOTAGEN: (n = "", s = "") => `'${n}' exports '${s}' but it is not a sub-generator.`,
  NOEXP: (n = "") => `${n} exists, but does not have any sub-generators.`,
};

export class PgenError extends Error {
  public code: ErrorCode;
  public subGenerators?: string[];
  public constructor(code: ErrorCode, name: string, subGenerator?: string, subGenerators?: string[]) {
    super(messages[code](name, subGenerator === "" || subGenerator === undefined ? "index.js or app" : subGenerator));
    this.code = code;
    this.subGenerators = subGenerators;
  }
}
