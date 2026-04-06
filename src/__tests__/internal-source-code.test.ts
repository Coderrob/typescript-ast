import { TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import { getLineIndentationPrefix, getNodeLinePrefix, getNodeLineText } from "../internal/source-code";

const OUT_OF_RANGE_LINE_NUMBER = 99;
const PREFIX_COLUMN = 3;

function createSourceCode(lines: readonly string[]) {
  return {
    lines,
    getCommentsBefore(): readonly TSESTree.Comment[] {
      return [];
    },
  };
}

function getExpressionStatementNode(code: string): TSESTree.Node {
  return parse(code, { jsx: false, loc: true }).body[0];
}

describe("internal/source-code", () => {
  describe("getLineIndentationPrefix", () => {
    it("should return indentation prefix", () => {
      expect(getLineIndentationPrefix("    const x = 1;")).toBe("    ");
    });

    it("should return empty string for non-indented lines", () => {
      expect(getLineIndentationPrefix("const x = 1;")).toBe("");
    });
  });

  describe("getNodeLinePrefix", () => {
    it("should return null when location data is unavailable", () => {
      const node = getExpressionStatementNode("x;");
      Reflect.set(node, "loc", null);
      expect(getNodeLinePrefix(createSourceCode(["x;"]), node)).toBeNull();
    });

    it("should return empty prefix when source line is missing", () => {
      const node = getExpressionStatementNode("x;");
      if (!node.loc) {
        throw new Error("Expected location data");
      }

      Reflect.set(node, "loc", {
        ...node.loc,
        start: { ...node.loc.start, line: OUT_OF_RANGE_LINE_NUMBER, column: PREFIX_COLUMN },
      });
      expect(getNodeLinePrefix(createSourceCode([]), node)).toBe("");
    });
  });

  describe("getNodeLineText", () => {
    it("should return null when location data is unavailable", () => {
      const node = getExpressionStatementNode("x;");
      Reflect.set(node, "loc", null);
      expect(getNodeLineText(createSourceCode(["x;"]), node)).toBeNull();
    });

    it("should return empty string when source line is missing", () => {
      const node = getExpressionStatementNode("x;");
      if (!node.loc) {
        throw new Error("Expected location data");
      }

      Reflect.set(node, "loc", {
        ...node.loc,
        start: { ...node.loc.start, line: OUT_OF_RANGE_LINE_NUMBER },
      });
      expect(getNodeLineText(createSourceCode([]), node)).toBe("");
    });
  });
});
