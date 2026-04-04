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
 * @param stopPredicate - Optional predicate that stops traversal into a node's children. A node matching both predicates is still returned; only its subtree is skipped.
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
    if (predicate(current)) {
      return current;
    }
    if (stopPredicate?.(current)) {
      stack = tail;
      continue;
    }
    stack = buildStack(getChildNodes(current, visitorKeys), tail);
  }
  return null;
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
 * Check if any descendant matches a predicate, optionally skipping stopped subtrees.
 * @param node - The root node to search from.
 * @param visitorKeys - The visitor keys map for traversal.
 * @param predicate - The predicate to match descendants against.
 * @param stopPredicate - Optional predicate that stops traversal into a subtree.
 * @returns True if any matching descendant exists.
 */
export function someDescendant(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
  stopPredicate?: (node: Readonly<TSESTree.Node>) => boolean
): boolean {
  return findDescendant(node, visitorKeys, predicate, stopPredicate) !== null;
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

function getChildNodes(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<Record<string, readonly string[] | undefined>>
): TSESTree.Node[] {
  return getChildNodesForKeys(node, visitorKeys[node.type] ?? []);
}

function getChildNodesForKeys(
  node: Readonly<TSESTree.Node>,
  keys: readonly string[]
): TSESTree.Node[] {
  return keys.flatMap((key) => getChildrenForKey(node, key));
}

function getChildrenForKey(node: Readonly<TSESTree.Node>, key: string): TSESTree.Node[] {
  const value: unknown = Reflect.get(node, key);
  if (!value) {
    return [];
  }

  const items: unknown[] = Array.isArray(value) ? value : [value];
  return items.filter(isAstNode);
}

function isAstNode(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && "type" in value;
}
