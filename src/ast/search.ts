/**
 * Depth-first descendant search helpers driven by ESTree visitor-key metadata.
 */
import { TSESTree } from "@typescript-eslint/types";
import { getVisitorChildNodes } from "../internal/visitor-children";

type TraversalStack = null | { readonly head: TSESTree.Node; readonly tail: TraversalStack };

/**
 * Public visitor-key map contract used by the search helpers.
 */
export type SearchVisitorKeyMapLike = Readonly<Record<string, readonly string[] | undefined>>;

/**
 * Build a linked-list DFS stack from a nodes array, prepending nodes in traversal order.
 * @param nodes - The nodes to prepend to the stack front.
 * @param tail - The existing stack to append the new nodes in front of.
 * @returns A new stack with nodes prepended in traversal order.
 */
function buildStack(nodes: readonly TSESTree.Node[], tail: Readonly<TraversalStack>): TraversalStack {
  let result: TraversalStack = tail;
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    result = { head: nodes[index], tail: result };
  }
  return result;
}

/**
 * Extend stack with current node children unless traversal is stopped.
 * @param node - The node currently being visited.
 * @param visitorKeys - The visitor keys map for traversal.
 * @param stack - The remaining traversal stack.
 * @param stopPredicate - Optional predicate that blocks descending into children.
 * @returns The next traversal stack.
 */
function extendStackWithChildren(
  node: Readonly<TSESTree.Node>,
  visitorKeys: Readonly<SearchVisitorKeyMapLike>,
  stack: Readonly<TraversalStack>,
  stopPredicate: ((node: Readonly<TSESTree.Node>) => boolean) | undefined,
): TraversalStack {
  if (shouldStopTraversal(stopPredicate, node)) {
    return stack;
  }

  return buildStack(getChildNodes(node, visitorKeys), stack);
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
  visitorKeys: Readonly<SearchVisitorKeyMapLike>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
  stopPredicate?: (node: Readonly<TSESTree.Node>) => boolean,
): TSESTree.Node | null {
  let stack = buildStack(getChildNodes(node, visitorKeys), null);
  while (stack !== null) {
    const { head: current, tail } = stack;
    stack = tail;

    if (predicate(current)) {
      return current;
    }

    stack = extendStackWithChildren(current, visitorKeys, stack, stopPredicate);
  }
  return null;
}

/**
 * Get all direct child AST nodes of a node using visitor keys.
 * @param node - The node to inspect.
 * @param visitorKeys - The visitor keys map.
 * @returns The direct child AST nodes.
 */
function getChildNodes(node: Readonly<TSESTree.Node>, visitorKeys: Readonly<SearchVisitorKeyMapLike>): TSESTree.Node[] {
  return getVisitorChildNodes(node, visitorKeys);
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
  visitorKeys: Readonly<SearchVisitorKeyMapLike>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
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
  visitorKeys: Readonly<SearchVisitorKeyMapLike>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
  stopPredicate: (node: Readonly<TSESTree.Node>) => boolean,
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
  visitorKeys: Readonly<SearchVisitorKeyMapLike>,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
  stopPredicate?: (node: Readonly<TSESTree.Node>) => boolean,
): boolean {
  return findDescendant(node, visitorKeys, predicate, stopPredicate) !== null;
}

/**
 * Determine whether traversal should stop at the current node.
 * @param stopPredicate - Optional predicate for blocking subtree traversal.
 * @param node - The node currently being visited.
 * @returns True when traversal into this node should stop.
 */
function shouldStopTraversal(
  stopPredicate: ((node: Readonly<TSESTree.Node>) => boolean) | undefined,
  node: Readonly<TSESTree.Node>,
): boolean {
  return stopPredicate !== undefined && stopPredicate(node);
}
