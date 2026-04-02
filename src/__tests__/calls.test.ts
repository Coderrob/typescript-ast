import { parse } from "@typescript-eslint/typescript-estree";
import { TSESTree } from "@typescript-eslint/types";
import {
  getCalleeNamePath,
  hasIdentifierCallee,
  hasMemberCallee,
  isNamedCall,
  isNamedMemberCall,
  getFirstCallArgument,
  getStringLiteralCallArgument,
} from "../ast/calls";

function parseCallExpr(code: string): TSESTree.CallExpression {
  const ast = parse(code, { jsx: false });
  return (ast.body[0] as TSESTree.ExpressionStatement).expression as TSESTree.CallExpression;
}

describe("calls", () => {
  describe("getCalleeNamePath", () => {
    it("returns name for simple identifier callee", () => {
      const call = parseCallExpr("foo()");
      expect(getCalleeNamePath(call.callee as TSESTree.LeftHandSideExpression)).toBe("foo");
    });

    it("returns dotted path for member expression callee", () => {
      const call = parseCallExpr("foo.bar()");
      expect(getCalleeNamePath(call.callee as TSESTree.LeftHandSideExpression)).toBe("foo.bar");
    });

    it("returns deep dotted path", () => {
      const call = parseCallExpr("a.b.c()");
      expect(getCalleeNamePath(call.callee as TSESTree.LeftHandSideExpression)).toBe("a.b.c");
    });

    it("returns null for computed member expression", () => {
      const call = parseCallExpr("foo[bar]()");
      expect(getCalleeNamePath(call.callee as TSESTree.LeftHandSideExpression)).toBeNull();
    });
  });

  describe("hasIdentifierCallee", () => {
    it("returns true when callee matches name", () => {
      const call = parseCallExpr("foo()");
      expect(hasIdentifierCallee(call, "foo")).toBe(true);
    });

    it("returns false when callee name differs", () => {
      const call = parseCallExpr("foo()");
      expect(hasIdentifierCallee(call, "bar")).toBe(false);
    });

    it("returns false for member expression callee", () => {
      const call = parseCallExpr("foo.bar()");
      expect(hasIdentifierCallee(call, "foo")).toBe(false);
    });
  });

  describe("hasMemberCallee", () => {
    it("returns true for member expression callee", () => {
      const call = parseCallExpr("foo.bar()");
      expect(hasMemberCallee(call)).toBe(true);
    });

    it("returns false for identifier callee", () => {
      const call = parseCallExpr("foo()");
      expect(hasMemberCallee(call)).toBe(false);
    });
  });

  describe("isNamedCall", () => {
    it("returns true for matching call name", () => {
      const call = parseCallExpr("foo()");
      expect(isNamedCall(call, "foo")).toBe(true);
    });

    it("returns true for dotted call name", () => {
      const call = parseCallExpr("foo.bar()");
      expect(isNamedCall(call, "foo.bar")).toBe(true);
    });

    it("returns false for non-matching name", () => {
      const call = parseCallExpr("foo()");
      expect(isNamedCall(call, "bar")).toBe(false);
    });
  });

  describe("isNamedMemberCall", () => {
    it("returns true for matching object.method", () => {
      const call = parseCallExpr("obj.method()");
      expect(isNamedMemberCall(call, "obj", "method")).toBe(true);
    });

    it("returns false for wrong method", () => {
      const call = parseCallExpr("obj.method()");
      expect(isNamedMemberCall(call, "obj", "other")).toBe(false);
    });

    it("returns false for wrong object", () => {
      const call = parseCallExpr("obj.method()");
      expect(isNamedMemberCall(call, "other", "method")).toBe(false);
    });

    it("returns false for identifier callee", () => {
      const call = parseCallExpr("foo()");
      expect(isNamedMemberCall(call, "foo", "bar")).toBe(false);
    });
  });

  describe("getFirstCallArgument", () => {
    it("returns first argument", () => {
      const call = parseCallExpr('foo("a", "b")');
      const arg = getFirstCallArgument(call);
      expect(arg).not.toBeNull();
    });

    it("returns null when no arguments", () => {
      const call = parseCallExpr("foo()");
      expect(getFirstCallArgument(call)).toBeNull();
    });
  });

  describe("getStringLiteralCallArgument", () => {
    it("returns string value at index", () => {
      const call = parseCallExpr('foo("hello")');
      expect(getStringLiteralCallArgument(call, 0)).toBe("hello");
    });

    it("returns second string argument", () => {
      const call = parseCallExpr('foo("a", "b")');
      expect(getStringLiteralCallArgument(call, 1)).toBe("b");
    });

    it("returns null for numeric argument", () => {
      const call = parseCallExpr("foo(42)");
      expect(getStringLiteralCallArgument(call, 0)).toBeNull();
    });

    it("returns null when index out of bounds", () => {
      const call = parseCallExpr("foo()");
      expect(getStringLiteralCallArgument(call, 0)).toBeNull();
    });
  });
});
