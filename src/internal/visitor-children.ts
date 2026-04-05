/**
 * Internal helpers for collecting child nodes from visitor-key metadata.
 * The implementation is iterative to keep traversal allocation patterns small
 * and the intent of each step explicit.
 */
import { TSESTree } from "@typescript-eslint/types";
import { isAstNode } from "./ast-runtime";

/**
 * Internal map from AST node type to visitor keys.
 */
export type VisitorKeyMap = Readonly<Record<string, readonly string[] | undefined>>;

/**
 * Collect child nodes exposed by one visitor key on a node.
 * @param node - The node to inspect.
 * @param key - The visitor key to read.
 * @returns The matching AST nodes for the visitor key.
 */
function getChildNodesForVisitorKey(node: Readonly<TSESTree.Node>, key: string): TSESTree.Node[] {
  return getChildNodesFromVisitorValue(Reflect.get(node, key));
}

/**
 * Collect child nodes across all visitor keys for a node.
 * @param node - The node to inspect.
 * @param keys - The visitor keys to process.
 * @param index - The current visitor-key index.
 * @returns The traversable child nodes from the current index onward.
 */
function getChildNodesForVisitorKeys(
  node: Readonly<TSESTree.Node>,
  keys: readonly string[],
  index: number,
): TSESTree.Node[] {
  const key = keys[index];
  if (key === undefined) {
    return [];
  }

  return [...getChildNodesForVisitorKey(node, key), ...getChildNodesForVisitorKeys(node, keys, index + 1)];
}

/**
 * Collect AST nodes from a visitor-key array value.
 * @param value - The visitor-key array value to inspect.
 * @returns The matching AST nodes from the array.
 */
function getChildNodesFromVisitorArray(value: readonly unknown[]): TSESTree.Node[] {
  return value.filter(isAstNode);
}

/**
 * Collect child nodes exposed by one visitor-key value.
 * @param value - The visitor-key value to inspect.
 * @returns The matching AST nodes for the visitor-key value.
 */
function getChildNodesFromVisitorValue(value: unknown): TSESTree.Node[] {
  if (Array.isArray(value)) {
    return getChildNodesFromVisitorArray(value);
  }

  return isAstNode(value) ? [value] : [];
}

/**
 * Collect direct child AST nodes using a visitor-keys map.
 * @param node - The node to inspect.
 * @param visitorKeys - The visitor-keys map.
 * @returns The traversable child nodes.
 */
export function getVisitorChildNodes(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<VisitorKeyMap>,
): TSESTree.Node[] {
  return getChildNodesForVisitorKeys(node, visitorKeys[node.type] ?? [], 0);
}
