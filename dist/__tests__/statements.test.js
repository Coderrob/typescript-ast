"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const statements_1 = require("../ast/statements");
function attachParents(ast) {
    (0, typescript_estree_1.simpleTraverse)(ast, {
        enter(node, parent) {
            if (parent) {
                node.parent = parent;
            }
        },
    }, true);
}
describe("statements", () => {
    describe("getSingleReturnStatement", () => {
        it("returns the return statement when block has exactly one return statement", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            const ret = (0, statements_1.getSingleReturnStatement)(block);
            expect(ret).not.toBeNull();
            expect(ret?.type).toBe("ReturnStatement");
        });
        it("returns null when block has multiple statements", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { const x = 1; return x; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            expect((0, statements_1.getSingleReturnStatement)(block)).toBeNull();
        });
        it("returns null when single statement is not return", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { const x = 1; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            expect((0, statements_1.getSingleReturnStatement)(block)).toBeNull();
        });
    });
    describe("getReturnStatement", () => {
        it("returns the statement if it is a ReturnStatement", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            const stmt = block.body[0];
            expect((0, statements_1.getReturnStatement)(stmt)).toBe(stmt);
        });
        it("returns null for non-ReturnStatement", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { const x = 1; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            expect((0, statements_1.getReturnStatement)(block.body[0])).toBeNull();
        });
    });
    describe("getBooleanLiteralReturnValue", () => {
        it("returns true for return true statement", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return true; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            expect((0, statements_1.getBooleanLiteralReturnValue)(block.body[0])).toBe(true);
        });
        it("returns false for return false statement", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return false; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            expect((0, statements_1.getBooleanLiteralReturnValue)(block.body[0])).toBe(false);
        });
        it("returns null for return numeric literal", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            const fn = ast.body[0];
            const block = fn.body;
            expect((0, statements_1.getBooleanLiteralReturnValue)(block.body[0])).toBeNull();
        });
        it("returns null for non-return statement", () => {
            const ast = (0, typescript_estree_1.parse)("const x = 1;", { jsx: false });
            expect((0, statements_1.getBooleanLiteralReturnValue)(ast.body[0])).toBeNull();
        });
    });
    describe("getFollowingStatementInBlock", () => {
        it("returns the next statement in the parent block", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { const x = 1; return x; }", { jsx: false });
            attachParents(ast);
            const fn = ast.body[0];
            const block = fn.body;
            const first = block.body[0];
            const second = block.body[1];
            expect((0, statements_1.getFollowingStatementInBlock)(first)).toBe(second);
        });
        it("returns null for last statement in block", () => {
            const ast = (0, typescript_estree_1.parse)("function f() { return 1; }", { jsx: false });
            attachParents(ast);
            const fn = ast.body[0];
            const block = fn.body;
            expect((0, statements_1.getFollowingStatementInBlock)(block.body[0])).toBeNull();
        });
        it("returns null when parent is not a block", () => {
            const ast = (0, typescript_estree_1.parse)("const x = 1;", { jsx: false });
            attachParents(ast);
            expect((0, statements_1.getFollowingStatementInBlock)(ast.body[0])).toBeNull();
        });
    });
});
//# sourceMappingURL=statements.test.js.map