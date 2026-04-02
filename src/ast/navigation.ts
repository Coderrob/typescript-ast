import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { isFunctionLike, isBlockStatement } from "../guards/nodes";

/**
 * Walk up the parent chain to find the first ancestor matching the predicate.
 * @param node - The starting node.
 * @param predicate - The predicate to match ancestors against.
 * @returns The first matching ancestor, or null if none found.
 */
export function findAncestor(
  node: Readonly<TSESTree.Node> | null | undefined,
  predicate: (node: Readonly<TSESTree.Node>) => boolean
): TSESTree.Node | null {
  const parent = node ? getNodeParent(node) : undefined;
  if (!parent) return null;
  if (predicate(parent)) return parent;
  return findAncestor(parent, predicate);
}

/**
 * Find nearest enclosing function-like node.
 * @param node - The starting node.
 * @returns The nearest enclosing function-like node, or null if none found.
 */
export function findEnclosingFunction(
  node: Readonly<TSESTree.Node> | null | undefined
): TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | TSESTree.TSDeclareFunction | null {
  const parent = node ? getNodeParent(node) : undefined;
  if (!parent) return null;
  if (isFunctionLike(parent)) return parent;
  return findEnclosingFunction(parent);
}

/**
 * Get the next sibling statement after node in a block.
 * @param block - The block statement containing the node.
 * @param node - The reference statement node.
 * @returns The next statement, or null if none.
 */
export function getNextStatementInBlock(
  block: Readonly<TSESTree.BlockStatement>,
  node: Readonly<TSESTree.Statement>
): TSESTree.Statement | null {
  for (const [i, stmt] of block.body.entries()) {
    if (stmt === node) return block.body[i + 1] ?? null;
  }
  return null;
}

/**
 * Get the parent node of a TSESTree node using runtime parent reference.
 * @param node - The AST node to get the parent of.
 * @returns The parent node, or undefined if none.
 */
export function getNodeParent(node: Readonly<TSESTree.Node>): TSESTree.Node | undefined {
  const parent: unknown = Reflect.get(node, "parent");
  if (isAstNode(parent)) return parent;
  return undefined;
}

/**
 * Get the parent BlockStatement of a node.
 * @param node - The node to find the parent block for.
 * @returns The nearest parent BlockStatement, or null if none found.
 */
export function getParentBlockStatement(
  node: Readonly<TSESTree.Node> | null | undefined
): TSESTree.BlockStatement | null {
  const parent = node ? getNodeParent(node) : undefined;
  if (!parent) return null;
  if (isBlockStatement(parent)) return parent;
  return getParentBlockStatement(parent);
}

/**
 * Check if a value is an AST node.
 * @param value - The value to check.
 * @returns True if the value has a type property characteristic of AST nodes.
 */
function isAstNode(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && "type" in value;
}

/**
 * Check if a node is inside a boundary defined by stopTypes where matchTypes are found.
 * @param node - The starting node.
 * @param stopTypes - AST node types that halt the upward traversal.
 * @param matchTypes - AST node types that indicate a positive match.
 * @returns True if a matchType ancestor is found before a stopType ancestor.
 */
export function isInsideBoundary(
  node: Readonly<TSESTree.Node> | null | undefined,
  stopTypes: readonly AST_NODE_TYPES[],
  matchTypes: readonly AST_NODE_TYPES[]
): boolean {
  const parent = node ? getNodeParent(node) : undefined;
  if (!parent) return false;
  if (matchTypes.includes(parent.type)) return true;
  if (stopTypes.includes(parent.type)) return false;
  return isInsideBoundary(parent, stopTypes, matchTypes);
}
