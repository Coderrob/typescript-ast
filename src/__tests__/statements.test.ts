import { TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  getBooleanLiteralReturnValue,
  getBooleanLiteralValue,
  getFollowingStatementInBlock,
  getReturnStatement,
  getSingleReturnStatement,
} from "../ast/statements";
import { asBlockStatement, asExpressionStatement, asFunctionDeclaration, attachParents } from "./helpers";

function parseExpr(code: string): TSESTree.Expression {
  return asExpressionStatement(parseProg(`${code};`).body[0]).expression;
}

function parseFn(code: string): TSESTree.FunctionDeclaration {
  return asFunctionDeclaration(parse(code, { jsx: false }).body[0]);
}

function parseProg(code: string): TSESTree.Program {
  return parse(code, { jsx: false });
}

function parseProgWithParents(code: string): TSESTree.Program {
  const ast = parse(code, { jsx: false });
  attachParents(ast);
  return ast;
}
function testGetBooleanLiteralReturnValue(): void {
  it("should return true for return true statement", () => {
    expect(getBooleanLiteralReturnValue(asBlockStatement(parseFn("function f() { return true; }").body).body[0])).toBe(
      true,
    );
  });
  it("should return false for return false statement", () => {
    expect(getBooleanLiteralReturnValue(asBlockStatement(parseFn("function f() { return false; }").body).body[0])).toBe(
      false,
    );
  });
  it("should reduce a single-return block before reading the value", () => {
    expect(getBooleanLiteralReturnValue(asBlockStatement(parseFn("function f() { return true; }").body))).toBe(true);
  });
  it("should return null for return numeric literal", () => {
    expect(
      getBooleanLiteralReturnValue(asBlockStatement(parseFn("function f() { return 1; }").body).body[0]),
    ).toBeNull();
  });
  it("should return null for non-return statement", () => {
    expect(getBooleanLiteralReturnValue(parseProg("const x = 1;").body[0])).toBeNull();
  });
}

function testGetBooleanLiteralValue(): void {
  it("should return boolean values from boolean literals", () => {
    expect(getBooleanLiteralValue(parseExpr("true"))).toBe(true);
    expect(getBooleanLiteralValue(parseExpr("false"))).toBe(false);
  });
  it("should return null for non-boolean expressions", () => {
    expect(getBooleanLiteralValue(parseExpr("1"))).toBeNull();
  });
}

function testGetFollowingStatementInBlock(): void {
  it("should return the next statement in the parent block", () => {
    const ast = parseProgWithParents("function f() { const x = 1; return x; }");
    const block = asBlockStatement(asFunctionDeclaration(ast.body[0]).body);
    expect(getFollowingStatementInBlock(block.body[0])).toBe(block.body[1]);
  });
  it("should return null for last statement in block", () => {
    const ast = parseProgWithParents("function f() { return 1; }");
    const block = asBlockStatement(asFunctionDeclaration(ast.body[0]).body);
    expect(getFollowingStatementInBlock(block.body[0])).toBeNull();
  });
  it("should return null when parent is not a block", () => {
    expect(getFollowingStatementInBlock(parseProgWithParents("const x = 1;").body[0])).toBeNull();
  });
}

function testGetReturnStatement(): void {
  it("should return null for null statement", () => {
    expect(getReturnStatement(null)).toBeNull();
  });

  it("should return the statement if it is a ReturnStatement", () => {
    const block = asBlockStatement(parseFn("function f() { return 1; }").body);
    expect(getReturnStatement(block.body[0])).toBe(block.body[0]);
  });
  it("should return a single return statement from a one-statement block", () => {
    const block = asBlockStatement(parseFn("function f() { return 1; }").body);
    expect(getReturnStatement(block)).toBe(block.body[0]);
  });
  it("should return null for non-ReturnStatement", () => {
    const block = asBlockStatement(parseFn("function f() { const x = 1; }").body);
    expect(getReturnStatement(block.body[0])).toBeNull();
  });
}

function testGetSingleReturnStatement(): void {
  it("should return the return statement when block has exactly one", () => {
    const block = asBlockStatement(parseFn("function f() { return 1; }").body);
    const ret = getSingleReturnStatement(block);
    expect(ret).not.toBeNull();
    expect(ret?.type).toBe("ReturnStatement");
  });
  it("should return null when block has multiple statements", () => {
    const block = asBlockStatement(parseFn("function f() { const x = 1; return x; }").body);
    expect(getSingleReturnStatement(block)).toBeNull();
  });
  it("should return null when single statement is not return", () => {
    expect(getSingleReturnStatement(asBlockStatement(parseFn("function f() { const x = 1; }").body))).toBeNull();
  });
}

describe("statements", () => {
  describe("getBooleanLiteralValue", testGetBooleanLiteralValue);
  describe("getBooleanLiteralReturnValue", testGetBooleanLiteralReturnValue);
  describe("getFollowingStatementInBlock", testGetFollowingStatementInBlock);
  describe("getReturnStatement", testGetReturnStatement);
  describe("getSingleReturnStatement", testGetSingleReturnStatement);
});
