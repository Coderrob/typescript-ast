import zeroTolerance from "@coderrob/eslint-plugin-zero-tolerance";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
    },
  },
  {
    files: ["src/**/*.ts"],
    ...zeroTolerance.configs.strict,
  },
  {
    files: ["src/**/*.test.ts"],
    rules: {
      "zero-tolerance/max-function-lines": "off",
    },
  },
];
