import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { isBlockStatement, isFunctionLike } from "../guards/nodes";

type BoundaryTypes = ReadonlySet<AST_NODE_TYPES> | ReadonlyArray<AST_NODE_TYPES>;

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
  if (!parent) {
    return null;
  }
  return predicate(parent) ? parent : findAncestor(parent, predicate);
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
  if (!parent) {
    return null;
  }
  return isFunctionLike(parent) ? parent : findEnclosingFunction(parent);
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
  const parent = node ? getNodeParent(node) : undefined;
  if (!parent) {
    return null;
  }
  return isBlockStatement(parent) ? parent : getParentBlockStatement(parent);
}

/**
 * Check whether a boundary list contains a given node type.
 * @param types - The boundary types to inspect.
 * @param expectedType - The node type to look for.
 * @returns True when the node type is present.
 */
function hasBoundaryType(
  types: Readonly<BoundaryTypes>,
  expectedType: Readonly<AST_NODE_TYPES>
): boolean {
  return isBoundaryArray(types)
    ? hasBoundaryTypeInArray(types, expectedType)
    : types.has(expectedType);
}

/**
 * Check whether a boundary array contains a given node type.
 * @param types - The boundary types to inspect.
 * @param expectedType - The node type to look for.
 * @returns True when the node type is present.
 */
function hasBoundaryTypeInArray(
  types: ReadonlyArray<AST_NODE_TYPES>,
  expectedType: Readonly<AST_NODE_TYPES>
): boolean {
  return types.includes(expectedType);
}

/**
 * Check whether a value is an AST node.
 * @param value - The value to inspect.
 * @returns True when the value is node-like.
 */
function isAstNode(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && "type" in value;
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
 * Check if a node or ancestor array is inside a boundary defined by stopTypes and matchTypes.
 * @param nodeOrAncestors - The starting node or ancestor array.
 * @param stopTypesOrMatchTypes - Stop types for node traversal, or match types for ancestor arrays.
 * @param matchTypesOrStopTypes - Match types for node traversal, or stop types for ancestor arrays.
 * @returns True if a match boundary is reached before a stop boundary.
 */
export function isInsideBoundary(
  nodeOrAncestors: Readonly<TSESTree.Node> | ReadonlyArray<TSESTree.Node> | null | undefined,
  stopTypesOrMatchTypes: Readonly<BoundaryTypes>,
  matchTypesOrStopTypes: Readonly<BoundaryTypes>
): boolean {
  if (isNodeArray(nodeOrAncestors)) {
    return isInsideBoundaryForAncestors(
      nodeOrAncestors,
      stopTypesOrMatchTypes,
      matchTypesOrStopTypes
    );
  }
  return nodeOrAncestors
    ? isInsideBoundaryForNode(nodeOrAncestors, stopTypesOrMatchTypes, matchTypesOrStopTypes)
    : false;
}

/**
 * Check boundary membership using an ancestor array.
 * @param ancestors - The ancestors ordered from outermost to innermost.
 * @param matchTypes - Boundary types that count as a match.
 * @param stopTypes - Boundary types that stop traversal.
 * @returns True if a match boundary is reached before a stop boundary.
 */
function isInsideBoundaryForAncestors(
  ancestors: ReadonlyArray<TSESTree.Node>,
  matchTypes: Readonly<BoundaryTypes>,
  stopTypes: Readonly<BoundaryTypes>
): boolean {
  const ancestor = ancestors[ancestors.length - 1];
  if (!ancestor) {
    return false;
  }
  if (hasBoundaryType(stopTypes, ancestor.type)) {
    return false;
  }
  if (hasBoundaryType(matchTypes, ancestor.type)) {
    return true;
  }
  return isInsideBoundaryForAncestors(ancestors.slice(0, -1), matchTypes, stopTypes);
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
  matchTypes: Readonly<BoundaryTypes>
): boolean {
  const parent = getNodeParent(node);
  if (!parent) {
    return false;
  }
  if (hasBoundaryType(matchTypes, parent.type)) {
    return true;
  }
  if (hasBoundaryType(stopTypes, parent.type)) {
    return false;
  }
  return isInsideBoundaryForNode(parent, stopTypes, matchTypes);
}

/**
 * Check whether a value is an array of AST nodes.
 * @param value - The value to inspect.
 * @returns True when the value is an AST node array.
 */
function isNodeArray(value: unknown): value is ReadonlyArray<TSESTree.Node> {
  return Array.isArray(value);
}
