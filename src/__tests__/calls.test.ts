import { TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  getCalleeNamePath,
  hasIdentifierCallee,
  hasMemberCallee,
  isNamedCall,
  isNamedMemberCall,
  getFirstCallArgument,
  getStringLiteralCallArgument,
} from "../ast/calls";
import { asCallExpression, asExpressionStatement } from "./helpers";

function parseCallExpr(code: string): TSESTree.CallExpression {
  const ast = parse(code, { jsx: false });
  return asCallExpression(asExpressionStatement(ast.body[0]).expression);
}

function testCalls(): void {
  describe("getCalleeNamePath", testGetCalleeNamePath);
  describe("hasIdentifierCallee", testHasIdentifierCallee);
  describe("hasMemberCallee", testHasMemberCallee);
  describe("isNamedCall", testIsNamedCall);
  describe("isNamedMemberCall", testIsNamedMemberCall);
  describe("getFirstCallArgument", testGetFirstCallArgument);
  describe("getStringLiteralCallArgument", testGetStringLiteralCallArgument);
}

function testGetCalleeNamePath(): void {
  it("should return name for simple identifier callee", () => {
    expect(getCalleeNamePath(parseCallExpr("foo()").callee)).toBe("foo");
  });
  it("should return dotted path for member expression callee", () => {
    expect(getCalleeNamePath(parseCallExpr("foo.bar()").callee)).toBe("foo.bar");
  });
  it("should return deep dotted path", () => {
    expect(getCalleeNamePath(parseCallExpr("a.b.c()").callee)).toBe("a.b.c");
  });
  it("should return null for computed member expression", () => {
    expect(getCalleeNamePath(parseCallExpr("foo[bar]()").callee)).toBeNull();
  });
}

function testGetFirstCallArgument(): void {
  it("should return first argument", () => {
    expect(getFirstCallArgument(parseCallExpr('foo("a", "b")'))).not.toBeNull();
  });
  it("should return null when no arguments", () => {
    expect(getFirstCallArgument(parseCallExpr("foo()"))).toBeNull();
  });
}

function testGetStringLiteralCallArgument(): void {
  it("should return string value at index", () => {
    expect(getStringLiteralCallArgument(parseCallExpr('foo("hello")'), 0)).toBe("hello");
  });
  it("should return second string argument", () => {
    expect(getStringLiteralCallArgument(parseCallExpr('foo("a", "b")'), 1)).toBe("b");
  });
  it("should return null for numeric argument", () => {
    expect(getStringLiteralCallArgument(parseCallExpr("foo(42)"), 0)).toBeNull();
  });
  it("should return null when index out of bounds", () => {
    expect(getStringLiteralCallArgument(parseCallExpr("foo()"), 0)).toBeNull();
  });
}

function testHasIdentifierCallee(): void {
  it("should return true when callee matches name", () => {
    expect(hasIdentifierCallee(parseCallExpr("foo()"), "foo")).toBe(true);
  });
  it("should return false when callee name differs", () => {
    expect(hasIdentifierCallee(parseCallExpr("foo()"), "bar")).toBe(false);
  });
  it("should return false for member expression callee", () => {
    expect(hasIdentifierCallee(parseCallExpr("foo.bar()"), "foo")).toBe(false);
  });
}

function testHasMemberCallee(): void {
  it("should return true for member expression callee", () => {
    expect(hasMemberCallee(parseCallExpr("foo.bar()"))).toBe(true);
  });
  it("should return false for identifier callee", () => {
    expect(hasMemberCallee(parseCallExpr("foo()"))).toBe(false);
  });
}

function testIsNamedCall(): void {
  it("should return true for matching call name", () => {
    expect(isNamedCall(parseCallExpr("foo()"), "foo")).toBe(true);
  });
  it("should return true for dotted call name", () => {
    expect(isNamedCall(parseCallExpr("foo.bar()"), "foo.bar")).toBe(true);
  });
  it("should return false for non-matching name", () => {
    expect(isNamedCall(parseCallExpr("foo()"), "bar")).toBe(false);
  });
}

function testIsNamedMemberCall(): void {
  it("should return true for matching object.method", () => {
    expect(isNamedMemberCall(parseCallExpr("obj.method()"), "obj", "method")).toBe(true);
  });
  it("should return false for wrong method", () => {
    expect(isNamedMemberCall(parseCallExpr("obj.method()"), "obj", "other")).toBe(false);
  });
  it("should return false for wrong object", () => {
    expect(isNamedMemberCall(parseCallExpr("obj.method()"), "other", "method")).toBe(false);
  });
  it("should return false for identifier callee", () => {
    expect(isNamedMemberCall(parseCallExpr("foo()"), "foo", "bar")).toBe(false);
  });
}

describe("calls", testCalls);
