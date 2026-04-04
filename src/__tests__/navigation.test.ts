import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  findAncestor,
  findEnclosingFunction,
  getNextStatementInBlock,
  getParentBlockStatement,
  isInsideBoundary,
} from "../ast/navigation";
import { isFunctionLike } from "../guards/nodes";
import {
  asBlockStatement,
  asExpressionStatement,
  asFunctionDeclaration,
  asForStatement,
  asReturnStatement,
  attachParents,
} from "./helpers";

function parseProg(code: string): TSESTree.Program {
  return parse(code, { jsx: false });
}

function parseProgWithParents(code: string): TSESTree.Program {
  const ast = parse(code, { jsx: false });
  attachParents(ast);
  return ast;
}

function parseFnBodyRet(code: string): TSESTree.Statement {
  const ast = parseProgWithParents(code);
  return asBlockStatement(asFunctionDeclaration(ast.body[0]).body).body[0];
}

function testFindAncestor(): void {
  it("should find an ancestor matching the predicate", () => {
    const ast = parseProgWithParents("function f() { return 1; }");
    const fn = asFunctionDeclaration(ast.body[0]);
    const ret = asReturnStatement(asBlockStatement(fn.body).body[0]);
    expect(findAncestor(ret, isFunctionLike)).toBe(fn);
  });
  it("should return null when no ancestor matches", () => {
    const stmt = asExpressionStatement(parseProgWithParents("x;").body[0]);
    expect(findAncestor(stmt, isFunctionLike)).toBeNull();
  });
  it("should return null for null input", () => {
    expect(findAncestor(null, () => true)).toBeNull();
  });
}

function testFindEnclosingFunction(): void {
  it("should find the enclosing function", () => {
    const ast = parseProgWithParents("function f() { return 1; }");
    const fn = asFunctionDeclaration(ast.body[0]);
    expect(findEnclosingFunction(asBlockStatement(fn.body).body[0])).toBe(fn);
  });
  it("should return null when not inside a function", () => {
    expect(findEnclosingFunction(parseProgWithParents("x;").body[0])).toBeNull();
  });
  it("should return null for null", () => {
    expect(findEnclosingFunction(null)).toBeNull();
  });
}

function testGetNextStatementInBlock(): void {
  it("should return next statement", () => {
    const block = asBlockStatement(
      asFunctionDeclaration(parseProg("function f() { const x = 1; return x; }").body[0]).body
    );
    expect(getNextStatementInBlock(block, block.body[0])).toBe(block.body[1]);
  });
  it("should return null for last statement", () => {
    const block = asBlockStatement(
      asFunctionDeclaration(parseProg("function f() { return 1; }").body[0]).body
    );
    expect(getNextStatementInBlock(block, block.body[0])).toBeNull();
  });
  it("should return null when node not in block", () => {
    const ast = parseProg("function f() { return 1; }");
    const block = asBlockStatement(asFunctionDeclaration(ast.body[0]).body);
    expect(getNextStatementInBlock(block, ast.body[0])).toBeNull();
  });
}

function testGetParentBlockStatement(): void {
  it("should return parent block statement", () => {
    const ast = parseProgWithParents("function f() { return 1; }");
    const fn = asFunctionDeclaration(ast.body[0]);
    const block = asBlockStatement(fn.body);
    expect(getParentBlockStatement(block.body[0])).toBe(block);
  });
  it("should return null when no block ancestor", () => {
    const stmt = asExpressionStatement(parseProgWithParents("x;").body[0]);
    expect(getParentBlockStatement(stmt)).toBeNull();
  });
  it("should return null for null", () => {
    expect(getParentBlockStatement(null)).toBeNull();
  });
}

function testIsInsideBoundary(): void {
  it("should return true when inside matchType", () => {
    const ret = parseFnBodyRet("function f() { return 1; }");
    expect(isInsideBoundary(ret, [], [AST_NODE_TYPES.FunctionDeclaration])).toBe(true);
  });
  it("should return false when stopped by stopType before matchType", () => {
    const ret = parseFnBodyRet("function f() { return 1; }");
    expect(isInsideBoundary(ret, [AST_NODE_TYPES.BlockStatement], [AST_NODE_TYPES.FunctionDeclaration])).toBe(false);
  });
  it("should support ancestor-array boundary checks", () => {
    const ast = parseProgWithParents("for (;;) { x; }");
    const loop = asForStatement(ast.body[0]);
    const block = asBlockStatement(loop.body);
    const ancestors = [ast, loop, block];

    expect(
      isInsideBoundary(
        ancestors,
        new Set([AST_NODE_TYPES.FunctionExpression]),
        new Set([AST_NODE_TYPES.ForStatement])
      )
    ).toBe(true);
  });
  it("should return false for null", () => {
    expect(isInsideBoundary(null, [], [AST_NODE_TYPES.Program])).toBe(false);
  });
}

function testNavigation(): void {
  describe("findAncestor", testFindAncestor);
  describe("findEnclosingFunction", testFindEnclosingFunction);
  describe("getNextStatementInBlock", testGetNextStatementInBlock);
  describe("getParentBlockStatement", testGetParentBlockStatement);
  describe("isInsideBoundary", testIsInsideBoundary);
}

describe("navigation", testNavigation);
