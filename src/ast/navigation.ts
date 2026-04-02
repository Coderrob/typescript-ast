import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { isFunctionLike, isBlockStatement } from "../guards/nodes";

/**
 * Walk up the parent chain to find the first ancestor matching the predicate.
 */
export function findAncestor(
  node: TSESTree.Node | null | undefined,
  predicate: (node: TSESTree.Node) => boolean
): TSESTree.Node | null {
  let current: TSESTree.Node | undefined = (node as (TSESTree.Node & { parent?: TSESTree.Node }) | undefined)?.parent;
  while (current) {
    if (predicate(current)) return current;
    current = (current as TSESTree.Node & { parent?: TSESTree.Node }).parent;
  }
  return null;
}

/**
 * Find nearest enclosing function-like node.
 */
export function findEnclosingFunction(
  node: TSESTree.Node | null | undefined
): TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | TSESTree.TSDeclareFunction | null {
  const ancestor = findAncestor(node, isFunctionLike);
  if (!ancestor) return null;
  return ancestor as TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | TSESTree.TSDeclareFunction;
}

/**
 * Check if a node is inside a boundary defined by stopTypes where matchTypes are found.
 */
export function isInsideBoundary(
  node: TSESTree.Node | null | undefined,
  stopTypes: AST_NODE_TYPES[],
  matchTypes: AST_NODE_TYPES[]
): boolean {
  let current: TSESTree.Node | undefined = (node as (TSESTree.Node & { parent?: TSESTree.Node }) | undefined)?.parent;
  while (current) {
    if (matchTypes.includes(current.type as AST_NODE_TYPES)) return true;
    if (stopTypes.includes(current.type as AST_NODE_TYPES)) return false;
    current = (current as TSESTree.Node & { parent?: TSESTree.Node }).parent;
  }
  return false;
}

/**
 * Get the parent BlockStatement of a node.
 */
export function getParentBlockStatement(
  node: TSESTree.Node | null | undefined
): TSESTree.BlockStatement | null {
  const ancestor = findAncestor(node, isBlockStatement);
  if (!ancestor) return null;
  return ancestor as TSESTree.BlockStatement;
}

/**
 * Get the next sibling statement after node in a block.
 */
export function getNextStatementInBlock(
  block: TSESTree.BlockStatement,
  node: TSESTree.Node
): TSESTree.Statement | null {
  const idx = block.body.indexOf(node as TSESTree.Statement);
  if (idx === -1 || idx === block.body.length - 1) return null;
  return block.body[idx + 1];
}
