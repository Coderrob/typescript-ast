/**
 * Ancestor and boundary navigation helpers for ESTree nodes with runtime
 * parent links.
 */
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { FunctionNode, isBlockStatement, isFunctionLike, isNodeLike } from "../guards/nodes";
import { getNodeParent as getRuntimeNodeParent, getNodeParentOrNull } from "../internal/ast-runtime";

type BoundaryTypes = ReadonlySet<AST_NODE_TYPES> | ReadonlyArray<AST_NODE_TYPES>;
type BoundaryNodeOrAncestors = Readonly<TSESTree.Node> | ReadonlyArray<TSESTree.Node> | null | undefined;
type OptionalNode = TSESTree.Node | undefined;

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
export function findEnclosingFunction(node: Readonly<TSESTree.Node> | null | undefined): FunctionNode | null {
  for (let parent = getNodeParentOrNull(node); parent !== null; parent = getNodeParentOrNull(parent)) {
    if (isFunctionLike(parent)) {
      return parent;
    }
  }

  return null;
}

/**
 * Resolve an ancestor boundary while preserving sparse-array behavior.
 * @param ancestor - The ancestor at the current index.
 * @param stopTypes - Boundary types that stop traversal.
 * @param matchTypes - Boundary types that count as a match.
 * @returns The boundary decision, or null to continue traversal.
 */
function getAncestorBoundaryDecision(
  ancestor: Readonly<TSESTree.Node> | undefined,
  stopTypes: Readonly<BoundaryTypes>,
  matchTypes: Readonly<BoundaryTypes>,
): boolean | null {
  return ancestor === undefined ? false : getBoundaryDecision(ancestor.type, stopTypes, matchTypes);
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
  nodeOrAncestors: Readonly<BoundaryNodeOrAncestors>,
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
  for (const ancestor of iterateAncestors(ancestors)) {
    const boundaryDecision = getAncestorBoundaryDecision(ancestor, stopTypes, matchTypes);
    if (boundaryDecision !== null) {
      return boundaryDecision;
    }
  }

  return false;
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
  for (const parent of iterateParentNodes(node)) {
    const boundaryDecision = getBoundaryDecision(parent.type, stopTypes, matchTypes);
    if (boundaryDecision !== null) {
      return boundaryDecision;
    }
  }

  return false;
}

/**
 * Check whether a value is an array of AST nodes.
 * @param value - The value to inspect.
 * @returns True when the value is an AST node array.
 */
function isNodeArray(value: unknown): value is ReadonlyArray<TSESTree.Node> {
  return Array.isArray(value) && value.every(isNodeLike);
}

/**
 * Iterate an ancestor array from innermost to outermost, including empty slots.
 * @param ancestors - The ancestors ordered from outermost to innermost.
 * @returns The ancestors in boundary-check order.
 */
function* iterateAncestors(ancestors: ReadonlyArray<TSESTree.Node>): Iterable<OptionalNode> {
  for (let index = ancestors.length - 1; index >= 0; index -= 1) {
    yield ancestors[index];
  }
}

/**
 * Iterate from a parent node toward the root without using the call stack.
 * @param node - The first parent node.
 * @returns Each parent node in boundary-check order.
 */
function* iterateParentNodes(node: Readonly<TSESTree.Node> | undefined): Iterable<TSESTree.Node> {
  for (let parent = node; parent !== undefined; parent = getNodeParent(parent)) {
    yield parent;
  }
}
