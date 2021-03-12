import { join } from "path";
import { promises as fs, existsSync } from "fs";
import { load } from "fs-structure";
import { ignoreCode } from "ignor";
import { tmpdir } from "os";
import { generate, Options } from "../src/index";
import App from "./test-helper/pg-generator-test/src/app/index";

const TEST_ROOT = join(tmpdir(), "pgen");
const outDir = join(TEST_ROOT, "out");
const outDir2 = join(TEST_ROOT, "out2");
const app = new App({ outDir }, { db: {}, templateDir: join(__dirname, "templates") } as any);
const CLIENT_OPTIONS = { database: "pg-generator-test", user: "user", password: "password" };

// WORKAROUND: Jest does not output error of dynamic import in (src/utils/compose-with.ts). This function rethrows error.
async function g(subGenerator = "app", options?: Options, { argLength = 3, cwd = "" } = {}): ReturnType<typeof load> {
  const oldCwd = process.cwd();
  if (cwd) process.chdir(cwd);

  const mergedOptions = {
    clear: true,
    log: false,
    outDir,
    relationNameFunctions: "optimal",
    ...CLIENT_OPTIONS,
    ...options,
  };

  try {
    // To test generate function with 2 paramerets and 3 parameters.
    if (argLength === 3) await generate(join(__dirname, "test-helper/pg-generator-test/src"), subGenerator, mergedOptions);
    else if (argLength === 2) await generate(join(__dirname, "test-helper/pg-generator-test/src", subGenerator), mergedOptions);
    else if (argLength === 1) await generate(join(__dirname, "test-helper/pg-generator-test/src", subGenerator));
    const structure = await load(mergedOptions.outDir ?? outDir);
    process.chdir(oldCwd);
    return structure;
  } catch (error) {
    process.chdir(oldCwd);
    throw new Error(error.message);
  }
}

afterAll(async () => {
  await fs.rmdir(TEST_ROOT, { recursive: true });
});

describe("generate", () => {
  it("should generate files.", async () => {
    expect(await g("app")).toMatchSnapshot();
  });

  it("should generate files if called with 2 arguments.", async () => {
    expect(await g("app", {}, { argLength: 2 })).toMatchSnapshot();
  });

  it("should generate files if called with 1 argument.", async () => {
    await expect(() => g("app", {}, { argLength: 1, cwd: outDir })).rejects.toThrow(" have same names");
  });

  it("should add context from context module using options.", async () => {
    expect(await g("app", { contextFile: join(__dirname, "test-helper/context.ts") })).toMatchSnapshot();
  });

  it("should add context from context module exporting function using options.", async () => {
    expect(await g("app", { contextFile: join(__dirname, "test-helper/context-as-function.ts") })).toMatchSnapshot();
  });

  it("should add context from context JSON file using options.", async () => {
    expect(await g("app", { contextFile: join(__dirname, "test-helper/context.json") })).toMatchSnapshot();
  });

  it("should not create files if render returns undefined.", async () => {
    expect(await g("useless")).toMatchSnapshot();
  });

  it("should throw error for relation name collisions.", async () => {
    await expect(() => g("app", { relationNameFunctions: "short" })).rejects.toThrow("relations have same names");
  });

  it("should throw error if clear is true without outDir.", async () => {
    await expect(() => g("app", { outDir: undefined })).rejects.toThrow("without 'outDir' option");
  });

  it("should not clear output directory if clear is false.", async () => {
    await g("app", { clear: false, outDir: outDir2 });
    expect(existsSync(outDir2)).toBe(true);
  });

  it("should throw if target is cwd and clear is true", async () => {
    await expect(() => g("app", { outDir: process.cwd() })).rejects.toThrow("CWD cannot be deleted");
  });

  it("should compose.", async () => {
    // TODO: eslint yada prettier snapshot'ı formatlıyor olabilir mi. Normalde çalışan test release'de hata veriyor.
    // lint-staged'den lint ve formatı kaldırınca hata olmuyor. test/__snapshots__ dizinini exclude et.
    expect(await g("composer")).toMatchSnapshot();
  });

  it("should output cwd if no outDir is provided.", async () => {
    await fs.rmdir(outDir, { recursive: true }).catch(ignoreCode("ENOENT"));
    await fs.mkdir(outDir);
    expect(await g("app", { outDir: undefined, clear: false }, { cwd: outDir })).toMatchSnapshot();
  });

  it("should throw if a filter in file name cannot be found.", async () => {
    await expect(() => g("error-path-filter")).rejects.toThrow("There is no 'non-existing' filter");
  });

  it("should throw if file name contains non-existing db object type.", async () => {
    await expect(() => g("error-db-object-type")).rejects.toThrow("'NonExisting' is not a known database object");
  });

  it("should throw if file name contains non-existing db object attribute.", async () => {
    await expect(() => g("error-db-object-attribute")).rejects.toThrow("'none' cannot be found");
  });

  it("should throw if generator cannot be found.", async () => {
    await expect(() => generate("XYZ")).rejects.toThrow("You don't seem to have a generator with the name 'XYZ' installed.");
  });

  it("should throw if sub-generator cannot be found.", async () => {
    await expect(() => g("XYZ")).rejects.toThrow("doesn't seem to have a sub-generator with the name 'XYZ'");
  });
});

describe("App", () => {
  it("should return default destination path.", () => {
    expect(app.defaultDestinationPath()).toBe(outDir);
  });

  it("should return default template path.", () => {
    expect(app.defaultTemplatePath()).toBe(join(__dirname, "templates"));
  });
});
