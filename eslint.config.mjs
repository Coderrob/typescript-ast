import zeroTolerance from "@coderrob/eslint-plugin-zero-tolerance";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.test.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      complexity: ["error", 3],
    },
  },
  {
    files: ["src/**/*.ts"],
    ...zeroTolerance.configs.strict,
  },
  {
    files: ["src/__tests__/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.test.json",
      },
    },
  },
  {
    files: ["src/**/*.test.ts"],
    rules: {
      complexity: "off",
      "zero-tolerance/max-function-lines": "off",
    },
  },
  {
    files: ["src/__tests__/helpers.ts"],
    rules: {
      complexity: "off",
    },
  },
];
