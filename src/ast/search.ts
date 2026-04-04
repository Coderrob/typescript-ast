import { TSESTree } from "@typescript-eslint/types";

type Stack = null | { readonly head: TSESTree.Node; readonly tail: Stack };

/**
 * Build a linked-list DFS stack from a nodes array, prepending nodes in traversal order.
 * @param nodes - The nodes to prepend to the stack front.
 * @param tail - The existing stack to append the new nodes in front of.
 * @returns A new stack with nodes prepended in traversal order.
 */
function buildStack(nodes: readonly TSESTree.Node[], tail: Readonly<Stack>): Stack {
  let result: Stack = tail;
  for (let i = nodes.length - 1; i >= 0; i -= 1) {
    result = { head: nodes[i], tail: result };
  }
  return result;
}

/**
 * Find the first descendant of node matching the predicate.
 * @param node - The root node to search from.
 * @param visitorKeys - The visitor keys map for traversal.
 * @param predicate - The predicate to match descendants against.
 * @returns The first matching descendant node, or null if none found.
 */
export function findDescendant(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean
): TSESTree.Node | null {
  let stack = buildStack(getChildNodes(node, visitorKeys), null);
  while (stack !== null) {
    const { head: current, tail } = stack;
    if (predicate(current)) return current;
    stack = buildStack(getChildNodes(current, visitorKeys), tail);
  }
  return null;
}

/**
 * Find the first descendant of node matching the predicate, halting subtree traversal when the stop predicate matches.
 * @param node - The root node to search from.
 * @param visitorKeys - The visitor keys map for traversal.
 * @param predicate - The predicate to match descendants against.
 * @param stopPredicate - The predicate that halts traversal into a subtree.
 * @returns The first matching descendant node, or null if none found before the stop condition.
 */
function findDescendantUntil(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
  stopPredicate: (node: Readonly<TSESTree.Node>) => boolean
): TSESTree.Node | null {
  let stack = buildStack(getChildNodes(node, visitorKeys), null);
  while (stack !== null) {
    const { head: current, tail } = stack;
    if (stopPredicate(current)) {
      stack = tail;
      continue;
    }
    if (predicate(current)) return current;
    stack = buildStack(getChildNodes(current, visitorKeys), tail);
  }
  return null;
}

/**
 * Get all direct child AST nodes of a node using visitor keys.
 * @param node - The parent node.
 * @param visitorKeys - The visitor keys map.
 * @returns Array of child AST nodes.
 */
function getChildNodes(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>
): TSESTree.Node[] {
  return getChildNodesForKeys(node, visitorKeys[node.type] ?? []);
}

/**
 * Collect child AST nodes across all visitor keys.
 * @param node - The parent node.
 * @param keys - The visitor keys to process.
 * @returns Array of child AST nodes.
 */
function getChildNodesForKeys(
  node: Readonly<TSESTree.Node>,
  keys: readonly string[]
): TSESTree.Node[] {
  /**
   * Get children for a single visitor key from the captured node.
   * @param key - The visitor key name.
   * @returns Array of child AST nodes for the key.
   */
  function childrenForKey(key: string): TSESTree.Node[] {
    return getChildrenForKey(node, key);
  }
  return keys.flatMap(childrenForKey);
}

/**
 * Get child AST nodes for a specific visitor key.
 * @param node - The parent AST node.
 * @param key - The visitor key name.
 * @returns Array of child AST nodes for this key.
 */
function getChildrenForKey(node: Readonly<TSESTree.Node>, key: string): TSESTree.Node[] {
  const value: unknown = Reflect.get(node, key);
  if (!value) return [];
  const items: unknown[] = Array.isArray(value) ? value : [value];
  return items.filter(isAstNode);
}

/**
 * Check if any descendant of node matches the predicate using visitor keys for traversal.
 * @param node - The root node to search from.
 * @param visitorKeys - The visitor keys map for traversal.
 * @param predicate - The predicate to match descendants against.
 * @returns True if any descendant matches the predicate.
 */
export function hasMatchingDescendant(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean
): boolean {
  return findDescendant(node, visitorKeys, predicate) !== null;
}

/**
 * Search descendants until stop condition is met.
 * @param node - The root node to search from.
 * @param visitorKeys - The visitor keys map for traversal.
 * @param predicate - The predicate to match descendants against.
 * @param stopPredicate - The predicate that halts traversal into a subtree.
 * @returns True if any descendant matches before the stop condition is reached.
 */
export function hasMatchingDescendantUntil(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
  stopPredicate: (node: Readonly<TSESTree.Node>) => boolean
): boolean {
  return findDescendantUntil(node, visitorKeys, predicate, stopPredicate) !== null;
}

/**
 * Check if a value is an AST node.
 * @param value - The value to check.
 * @returns True if the value has a type property characteristic of AST nodes.
 */
function isAstNode(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && "type" in value;
}
