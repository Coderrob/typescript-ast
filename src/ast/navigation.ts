import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { isBlockStatement, isFunctionLike } from "../guards/nodes";

/**
 * Walk up the parent chain to find the first ancestor matching the predicate.
 * @param node - The starting node.
 * @param predicate - The predicate to match ancestors against.
 * @returns The first matching ancestor, or null if none found.
 */
export function findAncestor<T extends TSESTree.Node>(
  node: Readonly<TSESTree.Node> | null | undefined,
  predicate: (node: Readonly<TSESTree.Node>) => node is T
): T | null;
export function findAncestor(
  node: Readonly<TSESTree.Node> | null | undefined,
  predicate: (node: Readonly<TSESTree.Node>) => boolean
): TSESTree.Node | null;
export function findAncestor(
  node: Readonly<TSESTree.Node> | null | undefined,
  predicate: (node: Readonly<TSESTree.Node>) => boolean
): TSESTree.Node | null {
  let currentNode = node ? getNodeParent(node) : undefined;
  while (currentNode !== undefined) {
    if (predicate(currentNode)) {
      return currentNode;
    }
    currentNode = getNodeParent(currentNode);
  }
  return null;
}

/**
 * Find nearest enclosing function-like node.
 * @param node - The starting node.
 * @returns The nearest enclosing function-like node, or null if none found.
 */
export function findEnclosingFunction(
  node: Readonly<TSESTree.Node> | null | undefined
): TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | TSESTree.TSDeclareFunction | null {
  let currentNode = node ? getNodeParent(node) : undefined;
  while (currentNode !== undefined) {
    if (isFunctionLike(currentNode)) {
      return currentNode;
    }
    currentNode = getNodeParent(currentNode);
  }
  return null;
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
  const index = block.body.indexOf(node);
  return index === -1 ? null : block.body[index + 1] ?? null;
}

/**
 * Get the parent node of a TSESTree node using runtime parent reference.
 * @param node - The AST node to get the parent of.
 * @returns The parent node, or undefined if none.
 */
export function getNodeParent(node: Readonly<TSESTree.Node>): TSESTree.Node | undefined {
  const parent: unknown = Reflect.get(node, "parent");
  return isAstNode(parent) ? parent : undefined;
}

/**
 * Get the parent BlockStatement of a node.
 * @param node - The node to find the parent block for.
 * @returns The nearest parent BlockStatement, or null if none found.
 */
export function getParentBlockStatement(
  node: Readonly<TSESTree.Node> | null | undefined
): TSESTree.BlockStatement | null {
  let currentNode = node ? getNodeParent(node) : undefined;
  while (currentNode !== undefined) {
    if (isBlockStatement(currentNode)) {
      return currentNode;
    }
    currentNode = getNodeParent(currentNode);
  }
  return null;
}

/**
 * Check if a node or ancestor array is inside a boundary defined by stopTypes and matchTypes.
 * @param ancestors - The ancestor array to walk (innermost-last).
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True if a match boundary is reached before a stop boundary.
 */
export function isInsideBoundary(
  ancestors: ReadonlyArray<TSESTree.Node>,
  stopTypes: ReadonlySet<AST_NODE_TYPES>,
  matchTypes: ReadonlySet<AST_NODE_TYPES>
): boolean;
/**
 * Check if a node is inside a boundary defined by stopTypes and matchTypes.
 * @param node - The starting node.
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True if a match boundary is reached before a stop boundary.
 */
export function isInsideBoundary(
  node: Readonly<TSESTree.Node> | null | undefined,
  stopTypes: readonly AST_NODE_TYPES[],
  matchTypes: readonly AST_NODE_TYPES[]
): boolean;
export function isInsideBoundary(
  nodeOrAncestors: Readonly<TSESTree.Node> | ReadonlyArray<TSESTree.Node> | null | undefined,
  stopTypes: readonly AST_NODE_TYPES[] | ReadonlySet<AST_NODE_TYPES>,
  matchTypes: readonly AST_NODE_TYPES[] | ReadonlySet<AST_NODE_TYPES>
): boolean {
  if (Array.isArray(nodeOrAncestors)) {
    const ancestors = nodeOrAncestors;
    const stopTypesSet = stopTypes as ReadonlySet<AST_NODE_TYPES>;
    const matchTypesSet = matchTypes as ReadonlySet<AST_NODE_TYPES>;
    for (let index = ancestors.length - 1; index >= 0; index -= 1) {
      const ancestorType = ancestors[index].type;
      if (stopTypesSet.has(ancestorType)) {
        return false;
      }
      if (matchTypesSet.has(ancestorType)) {
        return true;
      }
    }
    return false;
  }

  const stopTypesArr = stopTypes as readonly AST_NODE_TYPES[];
  const matchTypesArr = matchTypes as readonly AST_NODE_TYPES[];
  const node = nodeOrAncestors as Readonly<TSESTree.Node> | null | undefined;
  let currentNode = node ? getNodeParent(node) : undefined;
  while (currentNode !== undefined) {
    if (matchTypesArr.includes(currentNode.type)) {
      return true;
    }
    if (stopTypesArr.includes(currentNode.type)) {
      return false;
    }
    currentNode = getNodeParent(currentNode);
  }
  return false;
}

function isAstNode(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && "type" in value;
}
