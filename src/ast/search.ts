import { TSESTree } from "@typescript-eslint/types";

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
  for (const child of getChildNodes(node, visitorKeys)) {
    if (predicate(child)) return child;
    const found = findDescendant(child, visitorKeys, predicate);
    if (found) return found;
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
 * Recursively collect child AST nodes across all visitor keys.
 * @param node - The parent node.
 * @param keys - The remaining visitor keys to process.
 * @returns Array of child AST nodes.
 */
function getChildNodesForKeys(
  node: Readonly<TSESTree.Node>,
  keys: readonly string[]
): TSESTree.Node[] {
  const first = keys[0];
  if (first === undefined) return [];
  return [...getChildrenForKey(node, first), ...getChildNodesForKeys(node, keys.slice(1))];
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
  for (const child of getChildNodes(node, visitorKeys)) {
    if (predicate(child) || hasMatchingDescendant(child, visitorKeys, predicate)) return true;
  }
  return false;
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
  for (const child of getChildNodes(node, visitorKeys)) {
    if (stopPredicate(child)) continue;
    if (predicate(child) || hasMatchingDescendantUntil(child, visitorKeys, predicate, stopPredicate)) return true;
  }
  return false;
}

/**
 * Check if a value is an AST node.
 * @param value - The value to check.
 * @returns True if the value has a type property characteristic of AST nodes.
 */
function isAstNode(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && "type" in value;
}
