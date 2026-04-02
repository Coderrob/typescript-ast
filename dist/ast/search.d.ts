import { TSESTree } from "@typescript-eslint/types";
/**
 * Check if any descendant of node matches the predicate using visitor keys for traversal.
 */
export declare function someDescendant(node: TSESTree.Node, visitorKeys: Record<string, readonly string[]>, predicate: (node: TSESTree.Node) => boolean): boolean;
/**
 * Find the first descendant of node matching the predicate.
 */
export declare function findDescendant(node: TSESTree.Node, visitorKeys: Record<string, readonly string[]>, predicate: (node: TSESTree.Node) => boolean): TSESTree.Node | null;
/**
 * Search descendants until stop condition is met.
 */
export declare function someDescendantUntil(node: TSESTree.Node, visitorKeys: Record<string, readonly string[]>, predicate: (node: TSESTree.Node) => boolean, stopPredicate: (node: TSESTree.Node) => boolean): boolean;
//# sourceMappingURL=search.d.ts.map