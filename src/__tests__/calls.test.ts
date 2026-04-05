import { TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  getCallArgument,
  getCalleeNamePath,
  getFirstCallArgument,
  getMatchingCallMemberMethodName,
  getStringLiteralCallArgument,
  hasCallCalleeNamePath,
  hasIdentifierCallee,
  hasMemberCallee,
  isNamedCall,
  isNamedMemberCall,
} from "../ast/calls";
import { asCallExpression, asExpressionStatement } from "./test-helpers";

function parseCallExpr(code: string): TSESTree.CallExpression {
  const ast = parse(code, { jsx: false });
  return asCallExpression(asExpressionStatement(ast.body[0]).expression);
}

function testGetCallArgument(): void {
  it("should return the argument at the requested index", () => {
    expect(getCallArgument(parseCallExpr('foo("a", "b")'), 1)?.type).toBe("Literal");
  });
  it("should return null when the argument index is missing", () => {
    expect(getCallArgument(parseCallExpr("foo()"), 0)).toBeNull();
  });
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
  it("should resolve string-computed member expression paths", () => {
    expect(getCalleeNamePath(parseCallExpr('foo["bar"]()').callee)).toBe("foo.bar");
  });
  it("should unwrap call-expression callees before resolving the path", () => {
    expect(getCalleeNamePath(parseCallExpr("test.each()()").callee)).toBe("test.each");
  });
  it("should return null for member calls on another call result", () => {
    expect(getCalleeNamePath(parseCallExpr("foo().bar()").callee)).toBeNull();
  });
  it("should return null for unsupported computed member expression", () => {
    expect(getCalleeNamePath(parseCallExpr("foo[bar]()").callee)).toBeNull();
  });
  it("should return null when callee is not an identifier/member/call-expression", () => {
    expect(getCalleeNamePath(parseCallExpr("(foo ? bar : baz)()").callee)).toBeNull();
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

function testGetMatchingCallMemberMethodName(): void {
  it("should return a matched method name", () => {
    expect(getMatchingCallMemberMethodName(parseCallExpr("items.push()"), new Set(["push"]))).toBe("push");
  });
  it("should return null when no method name matches", () => {
    expect(getMatchingCallMemberMethodName(parseCallExpr("items.map()"), new Set(["push"]))).toBeNull();
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

function testHasCallCalleeNamePath(): void {
  it("should return true for matching callee segments", () => {
    expect(hasCallCalleeNamePath(parseCallExpr("foo.bar()"), ["foo", "bar"])).toBe(true);
  });
  it("should return false for non-matching callee segments", () => {
    expect(hasCallCalleeNamePath(parseCallExpr("foo.bar()"), ["foo", "baz"])).toBe(false);
  });
  it("should return false when segment lengths differ", () => {
    expect(hasCallCalleeNamePath(parseCallExpr("foo.bar()"), ["foo"])).toBe(false);
  });
  it("should return false for member calls on another call result", () => {
    expect(hasCallCalleeNamePath(parseCallExpr("foo().bar()"), ["foo", "bar"])).toBe(false);
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
  it("should return false for chained call expressions like foo()()", () => {
    expect(isNamedCall(parseCallExpr("foo()()"), "foo")).toBe(false);
  });
  it("should return false for member calls on another call result", () => {
    expect(isNamedCall(parseCallExpr("foo().bar()"), "foo.bar")).toBe(false);
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

describe("calls", () => {
  describe("getCallArgument", testGetCallArgument);
  describe("getCalleeNamePath", testGetCalleeNamePath);
  describe("getFirstCallArgument", testGetFirstCallArgument);
  describe("getStringLiteralCallArgument", testGetStringLiteralCallArgument);
  describe("getMatchingCallMemberMethodName", testGetMatchingCallMemberMethodName);
  describe("hasIdentifierCallee", testHasIdentifierCallee);
  describe("hasCallCalleeNamePath", testHasCallCalleeNamePath);
  describe("hasMemberCallee", testHasMemberCallee);
  describe("isNamedCall", testIsNamedCall);
  describe("isNamedMemberCall", testIsNamedMemberCall);
});
