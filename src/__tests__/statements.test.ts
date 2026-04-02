import { parse, simpleTraverse } from "@typescript-eslint/typescript-estree";
import { TSESTree } from "@typescript-eslint/types";
import {
  getSingleReturnStatement,
  getReturnStatement,
  getBooleanLiteralReturnValue,
  getFollowingStatementInBlock,
} from "../ast/statements";

function attachParents(ast: TSESTree.Program): void {
  simpleTraverse(
    ast,
    {
      enter(node, parent) {
        if (parent) {
          (node as TSESTree.Node & { parent: TSESTree.Node }).parent = parent;
        }
      },
    },
    true
  );
}

describe("statements", () => {
  describe("getSingleReturnStatement", () => {
    it("returns the return statement when block has exactly one return statement", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const ret = getSingleReturnStatement(block);
      expect(ret).not.toBeNull();
      expect(ret?.type).toBe("ReturnStatement");
    });

    it("returns null when block has multiple statements", () => {
      const ast = parse("function f() { const x = 1; return x; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      expect(getSingleReturnStatement(block)).toBeNull();
    });

    it("returns null when single statement is not return", () => {
      const ast = parse("function f() { const x = 1; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      expect(getSingleReturnStatement(block)).toBeNull();
    });
  });

  describe("getReturnStatement", () => {
    it("returns the statement if it is a ReturnStatement", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const stmt = block.body[0];
      expect(getReturnStatement(stmt)).toBe(stmt);
    });

    it("returns null for non-ReturnStatement", () => {
      const ast = parse("function f() { const x = 1; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      expect(getReturnStatement(block.body[0])).toBeNull();
    });
  });

  describe("getBooleanLiteralReturnValue", () => {
    it("returns true for return true statement", () => {
      const ast = parse("function f() { return true; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      expect(getBooleanLiteralReturnValue(block.body[0])).toBe(true);
    });

    it("returns false for return false statement", () => {
      const ast = parse("function f() { return false; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      expect(getBooleanLiteralReturnValue(block.body[0])).toBe(false);
    });

    it("returns null for return numeric literal", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      expect(getBooleanLiteralReturnValue(block.body[0])).toBeNull();
    });

    it("returns null for non-return statement", () => {
      const ast = parse("const x = 1;", { jsx: false });
      expect(getBooleanLiteralReturnValue(ast.body[0])).toBeNull();
    });
  });

  describe("getFollowingStatementInBlock", () => {
    it("returns the next statement in the parent block", () => {
      const ast = parse("function f() { const x = 1; return x; }", { jsx: false });
      attachParents(ast);
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const first = block.body[0];
      const second = block.body[1];
      expect(getFollowingStatementInBlock(first)).toBe(second);
    });

    it("returns null for last statement in block", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      attachParents(ast);
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      expect(getFollowingStatementInBlock(block.body[0])).toBeNull();
    });

    it("returns null when parent is not a block", () => {
      const ast = parse("const x = 1;", { jsx: false });
      attachParents(ast);
      expect(getFollowingStatementInBlock(ast.body[0])).toBeNull();
    });
  });
});
