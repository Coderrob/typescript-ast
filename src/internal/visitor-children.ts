/**
 * Internal helpers for collecting child nodes from visitor-key metadata.
 *
 * This module normalizes the shapes exposed by ESTree visitor keys:
 * - a single child node
 * - an array of child nodes
 * - non-node values, which are ignored
 *
 * The exported collector preserves the declared visitor-key order and the
 * original order of any node arrays so traversal helpers can build predictable
 * depth-first walks on top of it.
 */
import { TSESTree } from "@typescript-eslint/types";
import { isAstNode } from "./ast-runtime";

/**
 * Internal map from AST node type to visitor keys.
 *
 * Each key is an AST node type and each value is the ordered list of property
 * names that may expose traversable child nodes for that type.
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
 * @param visitorKeys - The visitor-keys map describing traversable properties.
 * @returns The traversable child nodes in visitor-key order.
 *
 * Missing visitor-key entries produce an empty result. Non-node property
 * values are ignored instead of causing traversal to fail.
 */
export function getVisitorChildNodes(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<VisitorKeyMap>,
): TSESTree.Node[] {
  return getChildNodesForVisitorKeys(node, visitorKeys[node.type] ?? [], 0);
}
