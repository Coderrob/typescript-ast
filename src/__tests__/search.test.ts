import { parse } from "@typescript-eslint/typescript-estree";
import { visitorKeys } from "@typescript-eslint/visitor-keys";
import { TSESTree } from "@typescript-eslint/types";
import {
  someDescendant,
  findDescendant,
  someDescendantUntil,
} from "../ast/search";
import { isIdentifier, isCallExpression } from "../guards/nodes";

const keys = visitorKeys as Record<string, readonly string[]>;

describe("search", () => {
  describe("someDescendant", () => {
    it("returns true when a descendant matches", () => {
      const ast = parse("foo()", { jsx: false });
      const result = someDescendant(ast, keys, isCallExpression);
      expect(result).toBe(true);
    });

    it("returns false when no descendant matches", () => {
      const ast = parse("x", { jsx: false });
      const result = someDescendant(ast, keys, isCallExpression);
      expect(result).toBe(false);
    });

    it("finds identifier in nested structure", () => {
      const ast = parse("foo.bar()", { jsx: false });
      const result = someDescendant(ast, keys, isIdentifier);
      expect(result).toBe(true);
    });
  });

  describe("findDescendant", () => {
    it("finds first matching descendant", () => {
      const ast = parse("foo()", { jsx: false });
      const found = findDescendant(ast, keys, isCallExpression);
      expect(found).not.toBeNull();
      expect(found?.type).toBe("CallExpression");
    });

    it("returns null when no descendant matches", () => {
      const ast = parse("x", { jsx: false });
      const found = findDescendant(ast, keys, isCallExpression);
      expect(found).toBeNull();
    });

    it("finds identifier in nested structure", () => {
      const ast = parse("foo.bar", { jsx: false });
      const found = findDescendant(ast, keys, isIdentifier);
      expect(found).not.toBeNull();
      expect((found as TSESTree.Identifier).name).toBe("foo");
    });
  });

  describe("someDescendantUntil", () => {
    it("returns true when a descendant matches before stop", () => {
      const ast = parse("foo()", { jsx: false });
      const result = someDescendantUntil(
        ast,
        keys,
        isCallExpression,
        () => false
      );
      expect(result).toBe(true);
    });

    it("returns false when stop predicate prevents traversal", () => {
      const ast = parse("foo()", { jsx: false });
      const result = someDescendantUntil(
        ast,
        keys,
        isCallExpression,
        (node) => node.type === "ExpressionStatement"
      );
      expect(result).toBe(false);
    });

    it("returns false when no descendant matches", () => {
      const ast = parse("x", { jsx: false });
      const result = someDescendantUntil(
        ast,
        keys,
        isCallExpression,
        () => false
      );
      expect(result).toBe(false);
    });
  });
});
