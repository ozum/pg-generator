import { join } from "path";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { load } from "fs-structure";
import { scaffold } from "../src/index";

const TEST_ROOT = join(tmpdir(), "pgen");
const outDir = join(TEST_ROOT, "out");

afterEach(async () => {
  await fs.rmdir(outDir, { recursive: true });
});

afterAll(async () => {
  await fs.rmdir(TEST_ROOT, { recursive: true });
});

describe("scaffold", () => {
  it("should generate nunjucks scaffold.", async () => {
    await scaffold("nunjucks", { outDir });
    const structure = await load(outDir);
    expect(structure).toMatchSnapshot();
  });

  it("should throw if no scaffold is provided.", async () => {
    await expect(() => scaffold(undefined as any, { outDir })).rejects.toThrow("is required");
  });

  it("should throw if unknown scaffold is provided.", async () => {
    await expect(() => scaffold("NON EXISTING SCAFFOLD", { outDir })).rejects.toThrow("Unknown scaffold");
  });

  it("should throw if destination directory has files in it.", async () => {
    await expect(() => scaffold("nunjucks", { outDir: join(__dirname, "test-helper/non-empty-dir") })).rejects.toThrow("is not empty");
  });

  it("should throw if destination directory is not a directory.", async () => {
    await expect(() => scaffold("nunjucks", { outDir: join(__dirname, "test-helper/non-empty-dir/file.txt") })).rejects.toThrow(
      "is not a directory"
    );
  });
});
