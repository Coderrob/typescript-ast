"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const types_1 = require("../ast/types");
describe("types", () => {
    describe("getTypeReferenceName", () => {
        it("returns name from simple TSTypeReference", () => {
            const ast = (0, typescript_estree_1.parse)("const x = null as Foo;", { jsx: false });
            const stmt = ast.body[0];
            const init = stmt.declarations[0].init;
            const typeRef = init.typeAnnotation;
            expect((0, types_1.getTypeReferenceName)(typeRef)).toBe("Foo");
        });
        it("returns null for qualified name", () => {
            const ast = (0, typescript_estree_1.parse)("const x = null as A.B;", { jsx: false });
            const stmt = ast.body[0];
            const init = stmt.declarations[0].init;
            const typeRef = init.typeAnnotation;
            expect((0, types_1.getTypeReferenceName)(typeRef)).toBeNull();
        });
    });
    describe("hasTypeArguments", () => {
        it("returns true for TSTypeReference with type arguments", () => {
            const ast = (0, typescript_estree_1.parse)("const x = null as Foo<Bar>;", { jsx: false });
            const stmt = ast.body[0];
            const init = stmt.declarations[0].init;
            const typeRef = init.typeAnnotation;
            expect((0, types_1.hasTypeArguments)(typeRef)).toBe(true);
        });
        it("returns false for TSTypeReference without type arguments", () => {
            const ast = (0, typescript_estree_1.parse)("const x = null as Foo;", { jsx: false });
            const stmt = ast.body[0];
            const init = stmt.declarations[0].init;
            const typeRef = init.typeAnnotation;
            expect((0, types_1.hasTypeArguments)(typeRef)).toBe(false);
        });
    });
    describe("hasAllReadonlyPropertyMembers", () => {
        it("returns true when all members are readonly", () => {
            const ast = (0, typescript_estree_1.parse)("type X = { readonly a: string; readonly b: number };", { jsx: false });
            const alias = ast.body[0];
            const typeLiteral = alias.typeAnnotation;
            expect((0, types_1.hasAllReadonlyPropertyMembers)(typeLiteral)).toBe(true);
        });
        it("returns false when not all members are readonly", () => {
            const ast = (0, typescript_estree_1.parse)("type X = { readonly a: string; b: number };", { jsx: false });
            const alias = ast.body[0];
            const typeLiteral = alias.typeAnnotation;
            expect((0, types_1.hasAllReadonlyPropertyMembers)(typeLiteral)).toBe(false);
        });
        it("returns true for empty type literal", () => {
            const ast = (0, typescript_estree_1.parse)("type X = {};", { jsx: false });
            const alias = ast.body[0];
            const typeLiteral = alias.typeAnnotation;
            expect((0, types_1.hasAllReadonlyPropertyMembers)(typeLiteral)).toBe(true);
        });
    });
    describe("unwrapTsExpression", () => {
        it("unwraps TSAsExpression", () => {
            const ast = (0, typescript_estree_1.parse)("x as string", { jsx: false });
            const node = ast.body[0].expression;
            const unwrapped = (0, types_1.unwrapTsExpression)(node);
            expect(unwrapped.type).toBe("Identifier");
        });
        it("unwraps nested TSAsExpression", () => {
            const ast = (0, typescript_estree_1.parse)("x as unknown as string", { jsx: false });
            const node = ast.body[0].expression;
            const unwrapped = (0, types_1.unwrapTsExpression)(node);
            expect(unwrapped.type).toBe("Identifier");
        });
        it("returns the node if not a TSAsExpression or TSSatisfiesExpression", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const node = ast.body[0].expression;
            expect((0, types_1.unwrapTsExpression)(node)).toBe(node);
        });
    });
    describe("isNamedTypeReference", () => {
        it("returns true for matching type reference name", () => {
            const ast = (0, typescript_estree_1.parse)("const x = null as Foo;", { jsx: false });
            const stmt = ast.body[0];
            const init = stmt.declarations[0].init;
            expect((0, types_1.isNamedTypeReference)(init.typeAnnotation, "Foo")).toBe(true);
        });
        it("returns false for non-matching name", () => {
            const ast = (0, typescript_estree_1.parse)("const x = null as Foo;", { jsx: false });
            const stmt = ast.body[0];
            const init = stmt.declarations[0].init;
            expect((0, types_1.isNamedTypeReference)(init.typeAnnotation, "Bar")).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, types_1.isNamedTypeReference)(null, "Foo")).toBe(false);
        });
    });
});
//# sourceMappingURL=types.test.js.map