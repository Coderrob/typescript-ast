"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const visitor_keys_1 = require("@typescript-eslint/visitor-keys");
const search_1 = require("../ast/search");
const nodes_1 = require("../guards/nodes");
const keys = visitor_keys_1.visitorKeys;
describe("search", () => {
    describe("someDescendant", () => {
        it("returns true when a descendant matches", () => {
            const ast = (0, typescript_estree_1.parse)("foo()", { jsx: false });
            const result = (0, search_1.someDescendant)(ast, keys, nodes_1.isCallExpression);
            expect(result).toBe(true);
        });
        it("returns false when no descendant matches", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const result = (0, search_1.someDescendant)(ast, keys, nodes_1.isCallExpression);
            expect(result).toBe(false);
        });
        it("finds identifier in nested structure", () => {
            const ast = (0, typescript_estree_1.parse)("foo.bar()", { jsx: false });
            const result = (0, search_1.someDescendant)(ast, keys, nodes_1.isIdentifier);
            expect(result).toBe(true);
        });
    });
    describe("findDescendant", () => {
        it("finds first matching descendant", () => {
            const ast = (0, typescript_estree_1.parse)("foo()", { jsx: false });
            const found = (0, search_1.findDescendant)(ast, keys, nodes_1.isCallExpression);
            expect(found).not.toBeNull();
            expect(found?.type).toBe("CallExpression");
        });
        it("returns null when no descendant matches", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const found = (0, search_1.findDescendant)(ast, keys, nodes_1.isCallExpression);
            expect(found).toBeNull();
        });
        it("finds identifier in nested structure", () => {
            const ast = (0, typescript_estree_1.parse)("foo.bar", { jsx: false });
            const found = (0, search_1.findDescendant)(ast, keys, nodes_1.isIdentifier);
            expect(found).not.toBeNull();
            expect(found.name).toBe("foo");
        });
    });
    describe("someDescendantUntil", () => {
        it("returns true when a descendant matches before stop", () => {
            const ast = (0, typescript_estree_1.parse)("foo()", { jsx: false });
            const result = (0, search_1.someDescendantUntil)(ast, keys, nodes_1.isCallExpression, () => false);
            expect(result).toBe(true);
        });
        it("returns false when stop predicate prevents traversal", () => {
            const ast = (0, typescript_estree_1.parse)("foo()", { jsx: false });
            const result = (0, search_1.someDescendantUntil)(ast, keys, nodes_1.isCallExpression, (node) => node.type === "ExpressionStatement");
            expect(result).toBe(false);
        });
        it("returns false when no descendant matches", () => {
            const ast = (0, typescript_estree_1.parse)("x", { jsx: false });
            const result = (0, search_1.someDescendantUntil)(ast, keys, nodes_1.isCallExpression, () => false);
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=search.test.js.map