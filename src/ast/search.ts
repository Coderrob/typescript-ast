import { TSESTree } from "@typescript-eslint/types";

/**
 * Check if any descendant of node matches the predicate using visitor keys for traversal.
 */
export function someDescendant(
  node: TSESTree.Node,
  visitorKeys: Record<string, readonly string[]>,
  predicate: (node: TSESTree.Node) => boolean
): boolean {
  const keys = visitorKeys[node.type] ?? [];
  for (const key of keys) {
    const child = (node as unknown as Record<string, unknown>)[key];
    if (!child) continue;
    const children = Array.isArray(child) ? child : [child];
    for (const c of children) {
      if (c && typeof c === "object" && "type" in c) {
        const childNode = c as TSESTree.Node;
        if (predicate(childNode) || someDescendant(childNode, visitorKeys, predicate)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Find the first descendant of node matching the predicate.
 */
export function findDescendant(
  node: TSESTree.Node,
  visitorKeys: Record<string, readonly string[]>,
  predicate: (node: TSESTree.Node) => boolean
): TSESTree.Node | null {
  const keys = visitorKeys[node.type] ?? [];
  for (const key of keys) {
    const child = (node as unknown as Record<string, unknown>)[key];
    if (!child) continue;
    const children = Array.isArray(child) ? child : [child];
    for (const c of children) {
      if (c && typeof c === "object" && "type" in c) {
        const childNode = c as TSESTree.Node;
        if (predicate(childNode)) return childNode;
        const found = findDescendant(childNode, visitorKeys, predicate);
        if (found) return found;
      }
    }
  }
  return null;
}

/**
 * Search descendants until stop condition is met.
 */
export function someDescendantUntil(
  node: TSESTree.Node,
  visitorKeys: Record<string, readonly string[]>,
  predicate: (node: TSESTree.Node) => boolean,
  stopPredicate: (node: TSESTree.Node) => boolean
): boolean {
  const keys = visitorKeys[node.type] ?? [];
  for (const key of keys) {
    const child = (node as unknown as Record<string, unknown>)[key];
    if (!child) continue;
    const children = Array.isArray(child) ? child : [child];
    for (const c of children) {
      if (c && typeof c === "object" && "type" in c) {
        const childNode = c as TSESTree.Node;
        if (stopPredicate(childNode)) continue;
        if (predicate(childNode) || someDescendantUntil(childNode, visitorKeys, predicate, stopPredicate)) {
          return true;
        }
      }
    }
  }
  return false;
}
