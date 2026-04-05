/**
 * Ancestor and boundary navigation helpers for ESTree nodes with runtime
 * parent links.
 */
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { isBlockStatement, isFunctionLike, isNodeLike } from "../guards/nodes";
import { getNodeParent as getRuntimeNodeParent, getNodeParentOrNull } from "../internal/ast-runtime";

type BoundaryTypes = ReadonlySet<AST_NODE_TYPES> | ReadonlyArray<AST_NODE_TYPES>;

/**
 * Walk up the parent chain to find the first ancestor matching the predicate.
 * @param node - The starting node.
 * @param predicate - The predicate to match ancestors against.
 * @returns The first matching ancestor, or null if none found.
 */
export function findAncestor<T extends TSESTree.Node>(
  node: Readonly<TSESTree.Node> | null | undefined,
  predicate: (node: Readonly<TSESTree.Node>) => node is T,
): T | null;
export function findAncestor(
  node: Readonly<TSESTree.Node> | null | undefined,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
): TSESTree.Node | null;
/**
 * Walk up the parent chain to find the first ancestor matching the predicate.
 * @param node - The starting node.
 * @param predicate - The predicate to match ancestors against.
 * @returns The first matching ancestor, or null if none found.
 */
export function findAncestor(
  node: Readonly<TSESTree.Node> | null | undefined,
  predicate: (node: Readonly<TSESTree.Node>) => boolean,
): TSESTree.Node | null {
  for (let parent = getNodeParentOrNull(node); parent !== null; parent = getNodeParentOrNull(parent)) {
    if (predicate(parent)) {
      return parent;
    }
  }

  return null;
}

/**
 * Find nearest enclosing function-like node.
 * @param node - The starting node.
 * @returns The nearest enclosing function-like node, or null if none found.
 */
export function findEnclosingFunction(
  node: Readonly<TSESTree.Node> | null | undefined,
):
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression
  | TSESTree.TSDeclareFunction
  | null {
  for (let parent = getNodeParentOrNull(node); parent !== null; parent = getNodeParentOrNull(parent)) {
    if (isFunctionLike(parent)) {
      return parent;
    }
  }

  return null;
}

/**
 * Resolve boundary decision for a node type.
 * @param nodeType - The current node type.
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True or false for a terminal decision, or null to continue traversal.
 */
function getBoundaryDecision(
  nodeType: Readonly<AST_NODE_TYPES>,
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
): boolean | null {
  if (hasBoundaryType(matchTypes, nodeType)) {
    return true;
  }

  return hasBoundaryType(stopTypes, nodeType) ? false : null;
}

/**
 * Get the next sibling statement after node in a block.
 * @param block - The block statement containing the node.
 * @param node - The reference statement node.
 * @returns The next statement, or null if none.
 */
export function getNextStatementInBlock(
  block: Readonly<TSESTree.BlockStatement>,
  node: Readonly<TSESTree.Statement>,
): TSESTree.Statement | null {
  const index = block.body.indexOf(node);
  return index === -1 ? null : (block.body[index + 1] ?? null);
}

/**
 * Get the parent node of a TSESTree node using runtime parent reference.
 * @param node - The AST node to get the parent of.
 * @returns The parent node, or undefined if none.
 */
export function getNodeParent(node: Readonly<TSESTree.Node>): TSESTree.Node | undefined {
  return getRuntimeNodeParent(node);
}

/**
 * Get the parent BlockStatement of a node.
 * @param node - The node to find the parent block for.
 * @returns The nearest parent BlockStatement, or null if none found.
 */
export function getParentBlockStatement(
  node: Readonly<TSESTree.Node> | null | undefined,
): TSESTree.BlockStatement | null {
  return findAncestor(node, isBlockStatement);
}

/**
 * Check whether a boundary list contains a given node type.
 * @param types - The boundary types to inspect.
 * @param expectedType - The node type to look for.
 * @returns True when the node type is present.
 */
function hasBoundaryType(types: Readonly<BoundaryTypes>, expectedType: Readonly<AST_NODE_TYPES>): boolean {
  return isBoundaryArray(types) ? hasBoundaryTypeInArray(types, expectedType) : types.has(expectedType);
}

/**
 * Check whether a boundary array contains a given node type.
 * @param types - The boundary types to inspect.
 * @param expectedType - The node type to look for.
 * @returns True when the node type is present.
 */
function hasBoundaryTypeInArray(types: ReadonlyArray<AST_NODE_TYPES>, expectedType: Readonly<AST_NODE_TYPES>): boolean {
  return types.includes(expectedType);
}

/**
 * Check whether a boundary collection is an array.
 * @param types - The boundary collection to inspect.
 * @returns True when the collection is an array.
 */
function isBoundaryArray(types: Readonly<BoundaryTypes>): types is ReadonlyArray<AST_NODE_TYPES> {
  return Array.isArray(types);
}

/**
 * Check if an ancestor array is inside a boundary defined by stopTypes and matchTypes.
 * @param ancestors - The ancestor array to walk (innermost-last).
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True if a match boundary is reached before a stop boundary.
 */
export function isInsideBoundary(
  ancestors: ReadonlyArray<TSESTree.Node>,
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
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
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
): boolean;
/**
 * Check whether a node or ancestor array is inside the requested boundary.
 * @param nodeOrAncestors - The starting node or ancestor array.
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True if a match boundary is reached before a stop boundary.
 */

export function isInsideBoundary(
  nodeOrAncestors: Readonly<TSESTree.Node> | ReadonlyArray<TSESTree.Node> | null | undefined,
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
): boolean {
  if (isNodeArray(nodeOrAncestors)) {
    return isInsideBoundaryForAncestors(nodeOrAncestors, stopTypes, matchTypes);
  }
  return nodeOrAncestors ? isInsideBoundaryForNode(nodeOrAncestors, stopTypes, matchTypes) : false;
}

/**
 * Check boundary membership using an ancestor array.
 * @param ancestors - The ancestors ordered from outermost to innermost.
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True if a match boundary is reached before a stop boundary.
 */
function isInsideBoundaryForAncestors(
  ancestors: ReadonlyArray<TSESTree.Node>,
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
): boolean {
  return isInsideBoundaryForAncestorsAtIndex(ancestors, ancestors.length - 1, stopTypes, matchTypes);
}

/**
 * Check boundary membership at a specific ancestor index.
 * @param ancestors - The ancestors ordered from outermost to innermost.
 * @param index - The current ancestor index.
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True if a match boundary is reached before a stop boundary.
 */
function isInsideBoundaryForAncestorsAtIndex(
  ancestors: ReadonlyArray<TSESTree.Node>,
  index: number,
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
): boolean {
  const ancestor = ancestors[index];
  if (ancestor === undefined) {
    return false;
  }

  const boundaryDecision = getBoundaryDecision(ancestor.type, stopTypes, matchTypes);
  if (boundaryDecision !== null) {
    return boundaryDecision;
  }

  return isInsideBoundaryForAncestorsAtIndex(ancestors, index - 1, stopTypes, matchTypes);
}

/**
 * Check boundary membership using a node's parent chain.
 * @param node - The starting node.
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True if a match boundary is reached before a stop boundary.
 */
function isInsideBoundaryForNode(
  node: Readonly<TSESTree.Node>,
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
): boolean {
  return isInsideBoundaryForParentNode(getNodeParent(node), stopTypes, matchTypes);
}

/**
 * Check boundary membership starting from a parent node.
 * @param node - The current parent node.
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns True if a match boundary is reached before a stop boundary.
 */
function isInsideBoundaryForParentNode(
  node: Readonly<TSESTree.Node> | undefined,
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
): boolean {
  if (!node) {
    return false;
  }

  const boundaryDecision = getBoundaryDecision(node.type, stopTypes, matchTypes);
  if (boundaryDecision !== null) {
    return boundaryDecision;
  }

  return isInsideBoundaryForParentNode(getNodeParent(node), stopTypes, matchTypes);
}

/**
 * Check whether a value is an array of AST nodes.
 * @param value - The value to inspect.
 * @returns True when the value is an AST node array.
 */
function isNodeArray(value: unknown): value is ReadonlyArray<TSESTree.Node> {
  return Array.isArray(value) && value.every(isNodeLike);
}
