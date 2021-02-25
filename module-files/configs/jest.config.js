const ignorePatterns = [".nosync", "<rootDir>/dist/", "<rootDir>/node_modules/", "/test-helper/", "/__test__/"];

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  modulePathIgnorePatterns: ["<rootDir>/node_modules.nosync/"],
};
