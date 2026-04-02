"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const types_1 = require("@typescript-eslint/types");
const navigation_1 = require("../ast/navigation");
const nodes_1 = require("../guards/nodes");
function attachParents(ast) {
    (0, typescript_estree_1.simpleTraverse)(ast, {
        enter(node, parent) {
            if (parent) {
                node.parent = parent;
            }
        },
    }, true);
}
describe("navigation", () => {
    describe("findAncestor", () => {
        it("finds an ancestor matching the predicate", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            attachParents(ast);
            const fn = ast.body[0];
            const block = fn.body;
            const ret = block.body[0];
            const found = (0, navigation_1.findAncestor)(ret, nodes_1.isFunctionLike);
            expect(found).toBe(fn);
        });
        it("returns null when no ancestor matches", () => {
            const ast = (0, typescript_estree_1.parse)("x;", { jsx: false });
            attachParents(ast);
            const stmt = ast.body[0];
            const found = (0, navigation_1.findAncestor)(stmt, nodes_1.isFunctionLike);
            expect(found).toBeNull();
        });
        it("returns null for null input", () => {
            expect((0, navigation_1.findAncestor)(null, () => true)).toBeNull();
        });
    });
    describe("findEnclosingFunction", () => {
        it("finds the enclosing function", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            attachParents(ast);
            const fn = ast.body[0];
            const block = fn.body;
            const ret = block.body[0];
            const found = (0, navigation_1.findEnclosingFunction)(ret);
            expect(found).toBe(fn);
        });
        it("returns null when not inside a function", () => {
            const ast = (0, typescript_estree_1.parse)("x;", { jsx: false });
            attachParents(ast);
            const stmt = ast.body[0];
            expect((0, navigation_1.findEnclosingFunction)(stmt)).toBeNull();
        });
        it("returns null for null", () => {
            expect((0, navigation_1.findEnclosingFunction)(null)).toBeNull();
        });
    });
    describe("isInsideBoundary", () => {
        it("returns true when inside matchType", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            attachParents(ast);
            const fn = ast.body[0];
            const block = fn.body;
            const ret = block.body[0];
            expect((0, navigation_1.isInsideBoundary)(ret, [], [types_1.AST_NODE_TYPES.FunctionDeclaration])).toBe(true);
        });
        it("returns false when stopped by stopType before matchType", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            attachParents(ast);
            const fn = ast.body[0];
            const block = fn.body;
            const ret = block.body[0];
            expect((0, navigation_1.isInsideBoundary)(ret, [types_1.AST_NODE_TYPES.BlockStatement], [types_1.AST_NODE_TYPES.FunctionDeclaration])).toBe(false);
        });
        it("returns false for null", () => {
            expect((0, navigation_1.isInsideBoundary)(null, [], [types_1.AST_NODE_TYPES.Program])).toBe(false);
        });
    });
    describe("getParentBlockStatement", () => {
        it("returns parent block statement", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            attachParents(ast);
            const fn = ast.body[0];
            const block = fn.body;
            const ret = block.body[0];
            const found = (0, navigation_1.getParentBlockStatement)(ret);
            expect(found).toBe(block);
        });
        it("returns null when no block ancestor", () => {
            const ast = (0, typescript_estree_1.parse)("x;", { jsx: false });
            attachParents(ast);
            const stmt = ast.body[0];
            expect((0, navigation_1.getParentBlockStatement)(stmt)).toBeNull();
        });
        it("returns null for null", () => {
            expect((0, navigation_1.getParentBlockStatement)(null)).toBeNull();
        });
    });
    describe("getNextStatementInBlock", () => {
        it("returns next statement", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { const x = 1; return x; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            const first = block.body[0];
            const second = block.body[1];
            expect((0, navigation_1.getNextStatementInBlock)(block, first)).toBe(second);
        });
        it("returns null for last statement", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            const last = block.body[0];
            expect((0, navigation_1.getNextStatementInBlock)(block, last)).toBeNull();
        });
        it("returns null when node not in block", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            expect((0, navigation_1.getNextStatementInBlock)(block, ast.body[0])).toBeNull();
        });
    });
});
//# sourceMappingURL=navigation.test.js.map