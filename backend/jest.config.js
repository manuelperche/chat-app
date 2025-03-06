/** @type {import('jest').Config} */
const config = {
    roots: ["<rootDir>"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    modulePathIgnorePatterns: [
      "<rootDir>/test/__fixtures__",
      "<rootDir>/node_modules",
      "<rootDir>/dist",
    ],
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
  };
  
  export default config;
  