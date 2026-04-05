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
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    result = { head: nodes[index], tail: result };
  }
  return result;
}

/**
 * Find the first descendant of node matching the predicate.
 * @param node - The root node to search from.
 * @param visitorKeys - The visitor keys map for traversal.
 * @param predicate - The predicate to match descendants against.
 * @param stopPredicate - Optional predicate that stops traversal into a subtree.
 * @returns The first matching descendant node, or null if none found.
 */
export function findDescendant(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
  stopPredicate?: (node: Readonly<TSESTree.Node>) => boolean
): TSESTree.Node | null {
  let stack = buildStack(getChildNodes(node, visitorKeys), null);
  while (stack !== null) {
    const { head: current, tail } = stack;
    if (stopPredicate?.(current)) {
      stack = tail;
      continue;
    }
    if (predicate(current)) {
      return current;
    }
    stack = buildStack(getChildNodes(current, visitorKeys), tail);
  }
  return null;
}

/**
 * Get all direct child AST nodes of a node using visitor keys.
 * @param node - The node to inspect.
 * @param visitorKeys - The visitor keys map.
 * @returns The direct child AST nodes.
 */
function getChildNodes(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>
): TSESTree.Node[] {
  return getChildNodesForKeys(node, visitorKeys[node.type] ?? []);
}

/**
 * Collect child AST nodes across a list of visitor keys.
 * @param node - The node to inspect.
 * @param keys - The visitor keys to process.
 * @returns The collected child AST nodes.
 */
function getChildNodesForKeys(
  node: Readonly<TSESTree.Node>,
  keys: readonly string[]
): TSESTree.Node[] {
  /**
   * Resolve child nodes for one visitor key on the current node.
   * @param key - The visitor key to read from the node.
   * @returns The child AST nodes for that key.
   */
  function getChildNodesForKey(key: string): TSESTree.Node[] {
    return getChildrenForKey(node, key);
  }
  return keys.flatMap(getChildNodesForKey);
}

/**
 * Get child AST nodes for a specific visitor key.
 * @param node - The node to inspect.
 * @param key - The visitor key to read.
 * @returns The child AST nodes for that key.
 */
function getChildrenForKey(node: Readonly<TSESTree.Node>, key: string): TSESTree.Node[] {
  return [...getChildrenForKeyValue(Reflect.get(node, key))];
}

/**
 * Normalize one visitor-key value into AST child nodes.
 * @param value - The visitor-key value to inspect.
 * @returns The child AST nodes for that value.
 */
function getChildrenForKeyValue(value: unknown): readonly TSESTree.Node[] {
  if (Array.isArray(value)) {
    return value.filter(isAstNode);
  }
  return isAstNode(value) ? [value] : [];
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
  return findDescendant(node, visitorKeys, predicate, stopPredicate) !== null;
}

/**
 * Check if any descendant matches a predicate, optionally skipping stopped subtrees.
 * @param node - The root node to search from.
 * @param visitorKeys - The visitor keys map for traversal.
 * @param predicate - The predicate to match descendants against.
 * @param stopPredicate - Optional predicate that stops traversal into a subtree.
 * @returns True if any matching descendant exists.
 */
export function hasSomeDescendant(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
  stopPredicate?: (node: Readonly<TSESTree.Node>) => boolean
): boolean {
  return findDescendant(node, visitorKeys, predicate, stopPredicate) !== null;
}

/**
 * Check whether a value is an AST node.
 * @param value - The value to inspect.
 * @returns True when the value is node-like.
 */
function isAstNode(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && "type" in value;
}
