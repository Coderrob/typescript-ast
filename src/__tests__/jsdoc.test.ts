import { AST_NODE_TYPES, AST_TOKEN_TYPES, TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  getJsdocComment,
  JsdocSourceCodeLike,
  getLineIndentation,
  getParentOwnedTargetNode,
  getTargetNode,
  getVariableOwnedTargetNode,
  isJsdocBlockComment,
  isParentOwnedTargetType,
  isStandaloneLineTarget,
} from "../ast/jsdoc";
import { asFunctionDeclaration, asFunctionExpression, asVariableDeclaration, attachParents } from "./test-helpers";

const JSDOC_COMMENT_END_COLUMN = 16;

function createJsdocComment(): TSESTree.Comment {
  return {
    type: AST_TOKEN_TYPES.Block,
    value: "* description",
    loc: {
      start: { line: 1, column: 0 },
      end: { line: 1, column: JSDOC_COMMENT_END_COLUMN },
    },
    range: [0, JSDOC_COMMENT_END_COLUMN],
  };
}

function createLocationlessNode(type: Readonly<AST_NODE_TYPES>): TSESTree.Node {
  const node = parseFunction("function foo() {}");
  Reflect.set(node, "type", type);
  Reflect.set(node, "loc", null);
  return node;
}

function createSourceCode(lines: readonly string[], comments: readonly TSESTree.Comment[] = []): JsdocSourceCodeLike {
  return {
    lines,
    getCommentsBefore() {
      return comments;
    },
  };
}

function parseFunction(code: string): TSESTree.FunctionDeclaration {
  return asFunctionDeclaration(parse(code, { jsx: false, loc: true }).body[0]);
}

function parseFunctionExpressionWithParents(code: string): TSESTree.FunctionExpression {
  const ast = parseProgramWithParents(code);
  return asFunctionExpression(asVariableDeclaration(ast.body[0]).declarations[0].init);
}

function parseProgramWithParents(code: string): TSESTree.Program {
  const ast = parse(code, { jsx: false, loc: true });
  attachParents(ast);
  return ast;
}

describe("jsdoc", () => {
  describe("getJsdocComment", () => {
    it("should return the nearest preceding jsdoc block", () => {
      const comment = createJsdocComment();
      const node = parseFunction("function foo() {}");
      expect(getJsdocComment(createSourceCode(["function foo() {}"], [comment]), node)).toBe(comment);
    });
  });

  describe("getLineIndentation", () => {
    it("should return the indentation for the node line", () => {
      const node = parseFunction("  function foo() {}");
      expect(getLineIndentation(createSourceCode(["  function foo() {}"]), node)).toBe("  ");
    });

    it("should return an empty string when location data is unavailable", () => {
      expect(
        getLineIndentation(
          createSourceCode(["  function foo() {}"]),
          createLocationlessNode(AST_NODE_TYPES.Identifier),
        ),
      ).toBe("");
    });
  });

  describe("isJsdocBlockComment", () => {
    it("should detect jsdoc block comments", () => {
      expect(isJsdocBlockComment(createJsdocComment())).toBe(true);
    });
  });

  describe("isStandaloneLineTarget", () => {
    it("should return true when only indentation precedes the node", () => {
      const node = parseFunction("  function foo() {}");
      expect(isStandaloneLineTarget(createSourceCode(["  function foo() {}"]), node)).toBe(true);
    });

    it("should return false when location data is unavailable", () => {
      expect(
        isStandaloneLineTarget(
          createSourceCode(["  function foo() {}"]),
          createLocationlessNode(AST_NODE_TYPES.Identifier),
        ),
      ).toBe(false);
    });
  });
  describe("target ownership", () => {
    it("should resolve parent-owned target nodes", () => {
      const ast = parseProgramWithParents("export default function foo() {}");
      const exportDefault = ast.body[0];
      if (exportDefault.type !== AST_NODE_TYPES.ExportDefaultDeclaration) {
        throw new Error("Expected ExportDefaultDeclaration");
      }

      const fn = asFunctionDeclaration(exportDefault.declaration);
      expect(getParentOwnedTargetNode(fn)).toBe(exportDefault);
      expect(getTargetNode(fn)).toBe(exportDefault);
    });

    it("should resolve variable-owned declaration and export targets", () => {
      const localFn = parseFunctionExpressionWithParents("const named = function () {};");
      const localTarget = getVariableOwnedTargetNode(localFn);
      expect(localTarget?.type).toBe(AST_NODE_TYPES.VariableDeclaration);

      const exportedAst = parseProgramWithParents("export const named = function () {};");
      const exportNamed = exportedAst.body[0];
      if (exportNamed.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
        throw new Error("Expected ExportNamedDeclaration");
      }

      const exportedFn = asFunctionExpression(asVariableDeclaration(exportNamed.declaration).declarations[0].init);
      expect(getVariableOwnedTargetNode(exportedFn)).toBe(exportNamed);
      expect(getTargetNode(exportedFn)).toBe(exportNamed);
    });

    it("should return declarator when declaration has multiple declarators", () => {
      const ast = parseProgramWithParents("const first = function () {}, second = 1;");
      const fn = asFunctionExpression(asVariableDeclaration(ast.body[0]).declarations[0].init);
      const owner = getVariableOwnedTargetNode(fn);
      expect(owner?.type).toBe(AST_NODE_TYPES.VariableDeclarator);
    });

    it("should return declarator when runtime parent is not a variable declaration", () => {
      const fn = parseFunctionExpressionWithParents("const named = function () {};");
      const declarator = getVariableOwnedTargetNode(fn);
      if (declarator === null) {
        throw new Error("Expected variable declarator");
      }

      Reflect.set(declarator, "parent", { type: AST_NODE_TYPES.Identifier });
      expect(getVariableOwnedTargetNode(fn)).toBe(declarator);
    });

    it("should return null when no parent-owned or variable-owned target exists", () => {
      const fn = parseFunction("function standalone() {}");
      expect(getParentOwnedTargetNode(fn)).toBeNull();
      expect(getVariableOwnedTargetNode(fn)).toBeNull();
      expect(getTargetNode(fn)).toBe(fn);
    });
  });

  describe("isParentOwnedTargetType", () => {
    it("should return true for parent-owned AST types", () => {
      expect(isParentOwnedTargetType(AST_NODE_TYPES.ExportNamedDeclaration)).toBe(true);
      expect(isParentOwnedTargetType(AST_NODE_TYPES.MethodDefinition)).toBe(true);
    });

    it("should return false for non-owned AST types", () => {
      expect(isParentOwnedTargetType(AST_NODE_TYPES.Identifier)).toBe(false);
    });
  });
});
