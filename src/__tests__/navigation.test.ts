import { parse, simpleTraverse } from "@typescript-eslint/typescript-estree";
import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import {
  findAncestor,
  findEnclosingFunction,
  isInsideBoundary,
  getParentBlockStatement,
  getNextStatementInBlock,
} from "../ast/navigation";
import { isFunctionLike } from "../guards/nodes";

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

describe("navigation", () => {
  describe("findAncestor", () => {
    it("finds an ancestor matching the predicate", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      attachParents(ast);
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const ret = block.body[0] as TSESTree.ReturnStatement;
      const found = findAncestor(ret, isFunctionLike);
      expect(found).toBe(fn);
    });

    it("returns null when no ancestor matches", () => {
      const ast = parse("x;", { jsx: false });
      attachParents(ast);
      const stmt = ast.body[0] as TSESTree.ExpressionStatement;
      const found = findAncestor(stmt, isFunctionLike);
      expect(found).toBeNull();
    });

    it("returns null for null input", () => {
      expect(findAncestor(null, () => true)).toBeNull();
    });
  });

  describe("findEnclosingFunction", () => {
    it("finds the enclosing function", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      attachParents(ast);
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const ret = block.body[0];
      const found = findEnclosingFunction(ret);
      expect(found).toBe(fn);
    });

    it("returns null when not inside a function", () => {
      const ast = parse("x;", { jsx: false });
      attachParents(ast);
      const stmt = ast.body[0];
      expect(findEnclosingFunction(stmt)).toBeNull();
    });

    it("returns null for null", () => {
      expect(findEnclosingFunction(null)).toBeNull();
    });
  });

  describe("isInsideBoundary", () => {
    it("returns true when inside matchType", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      attachParents(ast);
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const ret = block.body[0];
      expect(
        isInsideBoundary(ret, [], [AST_NODE_TYPES.FunctionDeclaration])
      ).toBe(true);
    });

    it("returns false when stopped by stopType before matchType", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      attachParents(ast);
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const ret = block.body[0];
      expect(
        isInsideBoundary(
          ret,
          [AST_NODE_TYPES.BlockStatement],
          [AST_NODE_TYPES.FunctionDeclaration]
        )
      ).toBe(false);
    });

    it("returns false for null", () => {
      expect(isInsideBoundary(null, [], [AST_NODE_TYPES.Program])).toBe(false);
    });
  });

  describe("getParentBlockStatement", () => {
    it("returns parent block statement", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      attachParents(ast);
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const ret = block.body[0];
      const found = getParentBlockStatement(ret);
      expect(found).toBe(block);
    });

    it("returns null when no block ancestor", () => {
      const ast = parse("x;", { jsx: false });
      attachParents(ast);
      const stmt = ast.body[0] as TSESTree.ExpressionStatement;
      expect(getParentBlockStatement(stmt)).toBeNull();
    });

    it("returns null for null", () => {
      expect(getParentBlockStatement(null)).toBeNull();
    });
  });

  describe("getNextStatementInBlock", () => {
    it("returns next statement", () => {
      const ast = parse("function f() { const x = 1; return x; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const first = block.body[0];
      const second = block.body[1];
      expect(getNextStatementInBlock(block, first)).toBe(second);
    });

    it("returns null for last statement", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      const last = block.body[0];
      expect(getNextStatementInBlock(block, last)).toBeNull();
    });

    it("returns null when node not in block", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const block = fn.body as TSESTree.BlockStatement;
      expect(getNextStatementInBlock(block, ast.body[0])).toBeNull();
    });
  });
});
