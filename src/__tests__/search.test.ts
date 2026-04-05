import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import { visitorKeys } from "@typescript-eslint/visitor-keys";
import {
  findDescendant,
  hasMatchingDescendant,
  hasMatchingDescendantUntil,
  hasSomeDescendant,
} from "../ast/search";
import { isCallExpression, isIdentifier } from "../guards/nodes";
import { asIdentifier } from "./helpers";

const keys = visitorKeys;

function testFindDescendant(): void {
  it("should find first matching descendant", () => {
    const found = findDescendant(parse("foo()", { jsx: false }), keys, isCallExpression);
    expect(found).not.toBeNull();
    expect(found?.type).toBe("CallExpression");
  });
  it("should return null when no descendant matches", () => {
    expect(findDescendant(parse("x", { jsx: false }), keys, isCallExpression)).toBeNull();
  });
  it("should find identifier in nested structure", () => {
    const found = findDescendant(parse("foo.bar", { jsx: false }), keys, isIdentifier);
    expect(found).not.toBeNull();
    expect(asIdentifier(found).name).toBe("foo");
  });
  it("should stop descending into blocked subtrees", () => {
    const found = findDescendant(
      parse("foo()", { jsx: false }),
      keys,
      isCallExpression,
      (node) => node.type === AST_NODE_TYPES.ExpressionStatement
    );
    expect(found).toBeNull();
  });
}

function testHasMatchingDescendant(): void {
  it("should return true when a descendant matches", () => {
    expect(hasMatchingDescendant(parse("foo()", { jsx: false }), keys, isCallExpression)).toBe(true);
  });
  it("should return false when no descendant matches", () => {
    expect(hasMatchingDescendant(parse("x", { jsx: false }), keys, isCallExpression)).toBe(false);
  });
  it("should find identifier in nested structure", () => {
    expect(hasMatchingDescendant(parse("foo.bar()", { jsx: false }), keys, isIdentifier)).toBe(true);
  });
}

function testHasMatchingDescendantUntil(): void {
  it("should return true when a descendant matches before stop", () => {
    const ast = parse("foo()", { jsx: false });
    expect(hasMatchingDescendantUntil(ast, keys, isCallExpression, () => false)).toBe(true);
  });
  it("should return false when stop predicate prevents traversal", () => {
    const ast = parse("foo()", { jsx: false });
    expect(
      hasMatchingDescendantUntil(
        ast,
        keys,
        isCallExpression,
        (node) => node.type === AST_NODE_TYPES.ExpressionStatement
      )
    ).toBe(false);
  });
  it("should return false when no descendant matches", () => {
    expect(hasMatchingDescendantUntil(parse("x", { jsx: false }), keys, isCallExpression, () => false)).toBe(false);
  });
}

function testHasSomeDescendant(): void {
  it("should return true when a descendant matches", () => {
    expect(hasSomeDescendant(parse("foo()", { jsx: false }), keys, isCallExpression)).toBe(true);
  });
  it("should respect the stop predicate", () => {
    expect(
      hasSomeDescendant(
        parse("foo()", { jsx: false }),
        keys,
        isCallExpression,
        (node) => node.type === AST_NODE_TYPES.ExpressionStatement
      )
    ).toBe(false);
  });
}

function testSearch(): void {
  describe("findDescendant", testFindDescendant);
  describe("hasMatchingDescendant", testHasMatchingDescendant);
  describe("hasMatchingDescendantUntil", testHasMatchingDescendantUntil);
  describe("hasSomeDescendant", testHasSomeDescendant);
}

describe("search", testSearch);
