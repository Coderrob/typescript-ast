"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const nodes_1 = require("../guards/nodes");
describe("guards", () => {
    describe("isIdentifier", () => {
        it("returns true for Identifier nodes", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isIdentifier)(node)).toBe(true);
        });
        it("returns false for non-Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("1", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isIdentifier)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isIdentifier)(null)).toBe(false);
        });
        it("returns false for undefined", () => {
            expect((0, nodes_1.isIdentifier)(undefined)).toBe(false);
        });
    });
    describe("isMemberExpression", () => {
        it("returns true for MemberExpression nodes", () => {
            const ast = (0, typescript_estree_1.parse)("foo.bar", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isMemberExpression)(node)).toBe(true);
        });
        it("returns false for Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isMemberExpression)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isMemberExpression)(null)).toBe(false);
        });
    });
    describe("isCallExpression", () => {
        it("returns true for CallExpression nodes", () => {
            const ast = (0, typescript_estree_1.parse)("foo()", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isCallExpression)(node)).toBe(true);
        });
        it("returns false for Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isCallExpression)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isCallExpression)(null)).toBe(false);
        });
    });
    describe("isLiteral", () => {
        it("returns true for numeric Literal", () => {
            const ast = (0, typescript_estree_1.parse)("1", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isLiteral)(node)).toBe(true);
        });
        it("returns true for string Literal", () => {
            const ast = (0, typescript_estree_1.parse)('"hello"', { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isLiteral)(node)).toBe(true);
        });
        it("returns false for Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isLiteral)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isLiteral)(null)).toBe(false);
        });
    });
    describe("isStringLiteral", () => {
        it("returns true for string Literal", () => {
            const ast = (0, typescript_estree_1.parse)('"hello"', { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isStringLiteral)(node)).toBe(true);
        });
        it("returns false for numeric Literal", () => {
            const ast = (0, typescript_estree_1.parse)("42", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isStringLiteral)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isStringLiteral)(null)).toBe(false);
        });
    });
    describe("isBlockStatement", () => {
        it("returns true for BlockStatement nodes", () => {
            const ast = (0, typescript_estree_1.parse)("function f() {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, nodes_1.isBlockStatement)(fn.body)).toBe(true);
        });
        it("returns false for Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isBlockStatement)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isBlockStatement)(null)).toBe(false);
        });
    });
    describe("isReturnStatement", () => {
        it("returns true for ReturnStatement nodes", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            const fn = ast.body[0];
            const stmt = fn.body.body[0];
            expect((0, nodes_1.isReturnStatement)(stmt)).toBe(true);
        });
        it("returns false for ExpressionStatement", () => {
            const ast = (0, typescript_estree_1.parse)("x;", { jsx: false });
            const node = ast.body[0];
            expect((0, nodes_1.isReturnStatement)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isReturnStatement)(null)).toBe(false);
        });
    });
    describe("isFunctionLike", () => {
        it("returns true for FunctionDeclaration", () => {
            const ast = (0, typescript_estree_1.parse)("function f() {}", { jsx: false });
            expect((0, nodes_1.isFunctionLike)(ast.body[0])).toBe(true);
        });
        it("returns true for FunctionExpression", () => {
            const ast = (0, typescript_estree_1.parse)("const f = function() {};", { jsx: false });
            const decl = ast.body[0];
            const init = decl.declarations[0].init;
            expect((0, nodes_1.isFunctionLike)(init)).toBe(true);
        });
        it("returns true for ArrowFunctionExpression", () => {
            const ast = (0, typescript_estree_1.parse)("const f = () => {};", { jsx: false });
            const decl = ast.body[0];
            const init = decl.declarations[0].init;
            expect((0, nodes_1.isFunctionLike)(init)).toBe(true);
        });
        it("returns false for Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isFunctionLike)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isFunctionLike)(null)).toBe(false);
        });
    });
    describe("isTSParameterProperty", () => {
        it("returns true for TSParameterProperty", () => {
            const ast = (0, typescript_estree_1.parse)("class C { constructor(private x: string) {} }", { jsx: false });
            const cls = ast.body[0];
            const ctor = cls.body.body[0];
            const fn = ctor.value;
            expect((0, nodes_1.isTSParameterProperty)(fn.params[0])).toBe(true);
        });
        it("returns false for regular parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x: string) {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, nodes_1.isTSParameterProperty)(fn.params[0])).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isTSParameterProperty)(null)).toBe(false);
        });
    });
    describe("isTSTypeAnnotation", () => {
        it("returns true for TSTypeAnnotation", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x: string) {}", { jsx: false });
            const fn = ast.body[0];
            const param = fn.params[0];
            expect((0, nodes_1.isTSTypeAnnotation)(param.typeAnnotation)).toBe(true);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isTSTypeAnnotation)(null)).toBe(false);
        });
    });
    describe("isTSTypeReference", () => {
        it("returns true for TSTypeReference", () => {
            const ast = (0, typescript_estree_1.parse)("const x = null as Foo;", { jsx: false });
            const stmt = ast.body[0];
            const init = stmt.declarations[0].init;
            expect((0, nodes_1.isTSTypeReference)(init.typeAnnotation)).toBe(true);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isTSTypeReference)(null)).toBe(false);
        });
    });
    describe("isTSTypeLiteral", () => {
        it("returns true for TSTypeLiteral", () => {
            const ast = (0, typescript_estree_1.parse)("type X = { a: string };", { jsx: false });
            const alias = ast.body[0];
            expect((0, nodes_1.isTSTypeLiteral)(alias.typeAnnotation)).toBe(true);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isTSTypeLiteral)(null)).toBe(false);
        });
    });
    describe("isTSPropertySignature", () => {
        it("returns true for TSPropertySignature", () => {
            const ast = (0, typescript_estree_1.parse)("type X = { a: string };", { jsx: false });
            const alias = ast.body[0];
            const typeLiteral = alias.typeAnnotation;
            expect((0, nodes_1.isTSPropertySignature)(typeLiteral.members[0])).toBe(true);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isTSPropertySignature)(null)).toBe(false);
        });
    });
    describe("isTSAsExpression", () => {
        it("returns true for TSAsExpression", () => {
            const ast = (0, typescript_estree_1.parse)("x as string", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isTSAsExpression)(node)).toBe(true);
        });
        it("returns false for Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isTSAsExpression)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isTSAsExpression)(null)).toBe(false);
        });
    });
    describe("isTSSatisfiesExpression", () => {
        it("returns true for TSSatisfiesExpression", () => {
            const ast = (0, typescript_estree_1.parse)("x satisfies string", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isTSSatisfiesExpression)(node)).toBe(true);
        });
        it("returns false for Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isTSSatisfiesExpression)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isTSSatisfiesExpression)(null)).toBe(false);
        });
    });
    describe("isThisExpression", () => {
        it("returns true for ThisExpression", () => {
            const ast = (0, typescript_estree_1.parse)("this", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isThisExpression)(node)).toBe(true);
        });
        it("returns false for Identifier", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, nodes_1.isThisExpression)(node)).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, nodes_1.isThisExpression)(null)).toBe(false);
        });
    });
});
//# sourceMappingURL=guards.test.js.map