"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const parameters_1 = require("../ast/parameters");
describe("parameters", () => {
    describe("getParameterTypeAnnotation", () => {
        it("returns type annotation from typed parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x: string) {}", { jsx: false });
            const fn = ast.body[0];
            const annotation = (0, parameters_1.getParameterTypeAnnotation)(fn.params[0]);
            expect(annotation).not.toBeNull();
            expect(annotation?.type).toBe("TSTypeAnnotation");
        });
        it("returns null for parameter without type annotation", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x) {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, parameters_1.getParameterTypeAnnotation)(fn.params[0])).toBeNull();
        });
    });
    describe("getParameterTypeNode", () => {
        it("returns type node from typed parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x: string) {}", { jsx: false });
            const fn = ast.body[0];
            const typeNode = (0, parameters_1.getParameterTypeNode)(fn.params[0]);
            expect(typeNode).not.toBeNull();
            expect(typeNode?.type).toBe("TSStringKeyword");
        });
        it("returns null when no annotation", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x) {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, parameters_1.getParameterTypeNode)(fn.params[0])).toBeNull();
        });
    });
    describe("getObjectDestructuredParameterTypeNode", () => {
        it("returns type node from object destructured parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f({ x }: MyType) {}", { jsx: false });
            const fn = ast.body[0];
            const typeNode = (0, parameters_1.getObjectDestructuredParameterTypeNode)(fn.params[0]);
            expect(typeNode).not.toBeNull();
        });
        it("returns null for non-object pattern parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x: string) {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, parameters_1.getObjectDestructuredParameterTypeNode)(fn.params[0])).toBeNull();
        });
    });
    describe("isThisParameter", () => {
        it("returns true for 'this' parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f(this: Foo) {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, parameters_1.isThisParameter)(fn.params[0])).toBe(true);
        });
        it("returns false for regular identifier parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x: string) {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, parameters_1.isThisParameter)(fn.params[0])).toBe(false);
        });
    });
    describe("getFirstNonThisParameter", () => {
        it("returns first non-this parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f(this: Foo, x: string) {}", { jsx: false });
            const fn = ast.body[0];
            const param = (0, parameters_1.getFirstNonThisParameter)(fn.params);
            expect(param).not.toBeNull();
            expect(param.name).toBe("x");
        });
        it("returns first parameter when no this param", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x: string) {}", { jsx: false });
            const fn = ast.body[0];
            const param = (0, parameters_1.getFirstNonThisParameter)(fn.params);
            expect(param.name).toBe("x");
        });
        it("returns null for empty params", () => {
            const ast = (0, typescript_estree_1.parse)("function f() {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, parameters_1.getFirstNonThisParameter)(fn.params)).toBeNull();
        });
    });
    describe("getTsParameterPropertyIdentifier", () => {
        it("returns identifier from TSParameterProperty", () => {
            const ast = (0, typescript_estree_1.parse)("class C { constructor(private x: string) {} }", { jsx: false });
            const cls = ast.body[0];
            const ctor = cls.body.body[0];
            const fn = ctor.value;
            const ident = (0, parameters_1.getTsParameterPropertyIdentifier)(fn.params[0]);
            expect(ident).not.toBeNull();
            expect(ident?.name).toBe("x");
        });
        it("returns null for regular parameter", () => {
            const ast = (0, typescript_estree_1.parse)("function f(x: string) {}", { jsx: false });
            const fn = ast.body[0];
            expect((0, parameters_1.getTsParameterPropertyIdentifier)(fn.params[0])).toBeNull();
        });
    });
});
//# sourceMappingURL=parameters.test.js.map