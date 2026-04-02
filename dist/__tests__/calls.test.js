"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const calls_1 = require("../ast/calls");
function parseCallExpr(code) {
    const ast = (0, typescript_estree_1.parse)(code, { jsx: false });
    return ast.body[0].expression;
}
describe("calls", () => {
    describe("getCalleeNamePath", () => {
        it("returns name for simple identifier callee", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.getCalleeNamePath)(call.callee)).toBe("foo");
        });
        it("returns dotted path for member expression callee", () => {
            const call = parseCallExpr("foo.bar()");
            expect((0, calls_1.getCalleeNamePath)(call.callee)).toBe("foo.bar");
        });
        it("returns deep dotted path", () => {
            const call = parseCallExpr("a.b.c()");
            expect((0, calls_1.getCalleeNamePath)(call.callee)).toBe("a.b.c");
        });
        it("returns null for computed member expression", () => {
            const call = parseCallExpr("foo[bar]()");
            expect((0, calls_1.getCalleeNamePath)(call.callee)).toBeNull();
        });
    });
    describe("hasIdentifierCallee", () => {
        it("returns true when callee matches name", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.hasIdentifierCallee)(call, "foo")).toBe(true);
        });
        it("returns false when callee name differs", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.hasIdentifierCallee)(call, "bar")).toBe(false);
        });
        it("returns false for member expression callee", () => {
            const call = parseCallExpr("foo.bar()");
            expect((0, calls_1.hasIdentifierCallee)(call, "foo")).toBe(false);
        });
    });
    describe("hasMemberCallee", () => {
        it("returns true for member expression callee", () => {
            const call = parseCallExpr("foo.bar()");
            expect((0, calls_1.hasMemberCallee)(call)).toBe(true);
        });
        it("returns false for identifier callee", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.hasMemberCallee)(call)).toBe(false);
        });
    });
    describe("isNamedCall", () => {
        it("returns true for matching call name", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.isNamedCall)(call, "foo")).toBe(true);
        });
        it("returns true for dotted call name", () => {
            const call = parseCallExpr("foo.bar()");
            expect((0, calls_1.isNamedCall)(call, "foo.bar")).toBe(true);
        });
        it("returns false for non-matching name", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.isNamedCall)(call, "bar")).toBe(false);
        });
    });
    describe("isNamedMemberCall", () => {
        it("returns true for matching object.method", () => {
            const call = parseCallExpr("obj.method()");
            expect((0, calls_1.isNamedMemberCall)(call, "obj", "method")).toBe(true);
        });
        it("returns false for wrong method", () => {
            const call = parseCallExpr("obj.method()");
            expect((0, calls_1.isNamedMemberCall)(call, "obj", "other")).toBe(false);
        });
        it("returns false for wrong object", () => {
            const call = parseCallExpr("obj.method()");
            expect((0, calls_1.isNamedMemberCall)(call, "other", "method")).toBe(false);
        });
        it("returns false for identifier callee", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.isNamedMemberCall)(call, "foo", "bar")).toBe(false);
        });
    });
    describe("getFirstCallArgument", () => {
        it("returns first argument", () => {
            const call = parseCallExpr('foo("a", "b")');
            const arg = (0, calls_1.getFirstCallArgument)(call);
            expect(arg).not.toBeNull();
        });
        it("returns null when no arguments", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.getFirstCallArgument)(call)).toBeNull();
        });
    });
    describe("getStringLiteralCallArgument", () => {
        it("returns string value at index", () => {
            const call = parseCallExpr('foo("hello")');
            expect((0, calls_1.getStringLiteralCallArgument)(call, 0)).toBe("hello");
        });
        it("returns second string argument", () => {
            const call = parseCallExpr('foo("a", "b")');
            expect((0, calls_1.getStringLiteralCallArgument)(call, 1)).toBe("b");
        });
        it("returns null for numeric argument", () => {
            const call = parseCallExpr("foo(42)");
            expect((0, calls_1.getStringLiteralCallArgument)(call, 0)).toBeNull();
        });
        it("returns null when index out of bounds", () => {
            const call = parseCallExpr("foo()");
            expect((0, calls_1.getStringLiteralCallArgument)(call, 0)).toBeNull();
        });
    });
});
//# sourceMappingURL=calls.test.js.map