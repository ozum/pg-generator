import { join } from "path";
import { readGenerators, importGenerator } from "../../src/utils";

describe("composeWith", () => {
  describe("readGenerators", () => {
    it("should read sub generators.", async () => {
      const generators = await readGenerators(join(__dirname, "../test-helper/pg-generator-test/src"));
      expect(generators).toEqual(expect.arrayContaining(["app", "composer", "useless"]));
    });

    it("should return undefined if generator does not exist.", async () => {
      expect(await readGenerators("XYZ")).toBe(undefined);
    });

    it("should return undefined if generator does not exist (include prefix).", async () => {
      expect(await readGenerators("pg-generator-XYZ")).toBe(undefined);
    });

    it("should read sub generators with relative path.", async () => {
      const oldCWD = process.cwd();
      process.chdir(__dirname);
      const generators = await readGenerators("../test-helper/pg-generator-test/src");
      expect(generators).toEqual(expect.arrayContaining(["app", "composer", "useless"]));
      process.chdir(oldCWD);
    });
  });

  describe("importGenerator", () => {
    it("should report if generator does not exist.", async () => {
      const generator = await importGenerator("XYZ", "none");
      expect(generator).toEqual([undefined, "XYZ"]);
    });

    it("should return undefined if imported module does not export generator.", async () => {
      const generator = await importGenerator(require.resolve("../test-helper/exporter.ts"), "hello");
      expect(generator[0]).toBe(undefined);
    });

    it("should return undefined if imported module does not export generator (non exported name).", async () => {
      const generator = await importGenerator(require.resolve("../test-helper/exporter.ts"), "non-existing");
      expect(generator[0]).toBe(undefined);
    });
  });
});
