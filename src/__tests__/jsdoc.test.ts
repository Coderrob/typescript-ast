import {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
  TSESTree,
} from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  getJsdocComment,
  getLineIndentation,
  isJsdocBlockComment,
  isStandaloneLineTarget,
} from "../ast/jsdoc";
import { asFunctionDeclaration } from "./helpers";

const JSDOC_COMMENT_END_COLUMN = 16;

type SourceCodeLike = {
  readonly lines: readonly string[];
  getCommentsBefore(node: Readonly<TSESTree.Node>): readonly TSESTree.Comment[];
};

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

function createSourceCode(
  lines: readonly string[],
  comments: readonly TSESTree.Comment[] = [],
): SourceCodeLike {
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

describe("jsdoc", () => {
  describe("getJsdocComment", () => {
    it("should return the nearest preceding jsdoc block", () => {
      const comment = createJsdocComment();
      const node = parseFunction("function foo() {}");
      expect(
        getJsdocComment(
          createSourceCode(["function foo() {}"], [comment]),
          node,
        ),
      ).toBe(comment);
    });
  });

  describe("getLineIndentation", () => {
    it("should return the indentation for the node line", () => {
      const node = parseFunction("  function foo() {}");
      expect(
        getLineIndentation(createSourceCode(["  function foo() {}"]), node),
      ).toBe("  ");
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
      expect(
        isStandaloneLineTarget(createSourceCode(["  function foo() {}"]), node),
      ).toBe(true);
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
});
