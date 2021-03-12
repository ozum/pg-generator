import { exists } from "../../src/utils";

describe("exists", () => {
  it("should return false if file does not exist.", async () => {
    expect(await exists("NON-EXISTING-FILE")).toBe(false);
  });

  it("should return false if input is undefined.", async () => {
    expect(await exists()).toBe(false);
  });
});
