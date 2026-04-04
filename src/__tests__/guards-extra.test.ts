import { TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  isBinaryExpression,
  isFunctionDeclaration,
  isMethodDefinition,
  isNamedIdentifier,
  isNodeLike,
  isSwitchCase,
  isTSEnumMember,
  isTSNonNullExpression,
  isTestFile,
  isUnaryExpression,
  isUncomputedMemberExpression,
  isVariableDeclaration,
  isVariableDeclarator,
} from "../guards/nodes";
import { asClassDeclaration, asExpressionStatement, asSwitchStatement, asTSEnumDeclaration, asVariableDeclaration } from "./helpers";

function parseExpr(code: string): TSESTree.Expression {
  return asExpressionStatement(parse(`${code};`, { jsx: false }).body[0]).expression;
}

describe("extra guards", () => {
  it("should identify binary expressions", () => {
    expect(isBinaryExpression(parseExpr("x + y"))).toBe(true);
    expect(isBinaryExpression(parseExpr("x"))).toBe(false);
  });

  it("should identify function declarations", () => {
    expect(isFunctionDeclaration(parse("function f() {}", { jsx: false }).body[0])).toBe(true);
    expect(isFunctionDeclaration(parseExpr("x"))).toBe(false);
  });

  it("should identify method definitions", () => {
    const cls = asClassDeclaration(parse("class C { method() {} }", { jsx: false }).body[0]);
    expect(isMethodDefinition(cls.body.body[0])).toBe(true);
    expect(isMethodDefinition(parseExpr("x"))).toBe(false);
  });

  it("should identify named identifiers and node-like values", () => {
    expect(isNamedIdentifier(parseExpr("Promise"), "Promise")).toBe(true);
    expect(isNamedIdentifier(parseExpr("Promise"), "Date")).toBe(false);
    expect(isNodeLike(parseExpr("x"))).toBe(true);
    expect(isNodeLike({ type: "Identifier" })).toBe(true);
    expect(isNodeLike({ type: 42 })).toBe(false);
  });

  it("should identify switch cases and enum members", () => {
    const switchStatement = asSwitchStatement(parse("switch (x) { case 1: break; }", { jsx: false }).body[0]);
    const enumDeclaration = asTSEnumDeclaration(parse("enum E { A = 1 }", { jsx: false }).body[0]);
    expect(isSwitchCase(switchStatement.cases[0])).toBe(true);
    expect(isTSEnumMember(enumDeclaration.body.members[0])).toBe(true);
  });

  it("should identify TS non-null, unary, and uncomputed member expressions", () => {
    expect(isTSNonNullExpression(parseExpr("x!"))).toBe(true);
    expect(isUnaryExpression(parseExpr("!x"))).toBe(true);
    expect(isUncomputedMemberExpression(parseExpr("foo.bar"))).toBe(true);
    expect(isUncomputedMemberExpression(parseExpr("foo[bar]"))).toBe(false);
  });

  it("should identify variable declarations and declarators", () => {
    const declaration = asVariableDeclaration(parse("const x = 1;", { jsx: false }).body[0]);
    expect(isVariableDeclaration(declaration)).toBe(true);
    expect(isVariableDeclarator(declaration.declarations[0])).toBe(true);
  });

  it("should identify common test file paths", () => {
    expect(isTestFile("src/foo.test.ts")).toBe(true);
    expect(isTestFile("src\\__tests__\\foo.ts")).toBe(true);
    expect(isTestFile("src/foo.ts")).toBe(false);
  });
});
