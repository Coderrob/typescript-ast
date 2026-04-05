/**
 * Internal helpers for reading line-oriented source text around AST nodes.
 * These utilities operate on structural source-code objects and never assume
 * that `loc` data is present on every node.
 */
import { TSESTree } from "@typescript-eslint/types";
import { getNodeStart } from "./ast-runtime";

type LineIndexedSourceCodeLike = {
  readonly lines: readonly string[];
  getCommentsBefore(node: Readonly<TSESTree.Node>): readonly TSESTree.Comment[];
};

/**
 * Get the indentation prefix for a line of source text.
 * @param lineText - The line text to inspect.
 * @returns The leading indentation characters.
 */
export function getLineIndentationPrefix(lineText: string): string {
  return lineText.slice(0, lineText.length - lineText.trimStart().length);
}

/**
 * Get the source text prefix before a node's start column.
 * @param sourceCode - The source-code-like object to inspect.
 * @param node - The node to inspect.
 * @returns The line prefix, or null when location data is unavailable.
 */
export function getNodeLinePrefix(
  sourceCode: Readonly<LineIndexedSourceCodeLike>,
  node: Readonly<TSESTree.Node>,
): string | null {
  const start = getNodeStart(node);
  if (start === null) {
    return null;
  }

  const lineText = sourceCode.lines[start.line - 1] ?? "";
  return lineText.slice(0, start.column);
}

/**
 * Get the full source line containing a node start.
 * @param sourceCode - The source-code-like object to inspect.
 * @param node - The node to inspect.
 * @returns The source line, or null when location data is unavailable.
 */
export function getNodeLineText(
  sourceCode: Readonly<LineIndexedSourceCodeLike>,
  node: Readonly<TSESTree.Node>,
): string | null {
  const start = getNodeStart(node);
  if (start === null) {
    return null;
  }

  return sourceCode.lines[start.line - 1] ?? "";
}
