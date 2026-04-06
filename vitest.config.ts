import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    globals: true,
    environment: "node",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/__tests__/**"],
      thresholds: {
        perFile: true,
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
    },
  },
});
