import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
/**
 * Walk up the parent chain to find the first ancestor matching the predicate.
 */
export declare function findAncestor(node: TSESTree.Node | null | undefined, predicate: (node: TSESTree.Node) => boolean): TSESTree.Node | null;
/**
 * Find nearest enclosing function-like node.
 */
export declare function findEnclosingFunction(node: TSESTree.Node | null | undefined): TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | TSESTree.TSDeclareFunction | null;
/**
 * Check if a node is inside a boundary defined by stopTypes where matchTypes are found.
 */
export declare function isInsideBoundary(node: TSESTree.Node | null | undefined, stopTypes: AST_NODE_TYPES[], matchTypes: AST_NODE_TYPES[]): boolean;
/**
 * Get the parent BlockStatement of a node.
 */
export declare function getParentBlockStatement(node: TSESTree.Node | null | undefined): TSESTree.BlockStatement | null;
/**
 * Get the next sibling statement after node in a block.
 */
export declare function getNextStatementInBlock(block: TSESTree.BlockStatement, node: TSESTree.Node): TSESTree.Statement | null;
//# sourceMappingURL=navigation.d.ts.map