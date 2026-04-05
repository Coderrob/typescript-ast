import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { FunctionNode, isNodeLike, isVariableDeclarator } from "../guards/nodes";

type SourceCodeLike = {
  readonly lines: readonly string[];
  getCommentsBefore(node: Readonly<TSESTree.Node>): readonly TSESTree.Comment[];
};

const JSDOC_BLOCK_MARKER = "*";
const BLOCK_COMMENT_TYPE = "Block";

const PARENT_OWNED_TARGET_TYPES = new Set<AST_NODE_TYPES>([
  AST_NODE_TYPES.ExportDefaultDeclaration,
  AST_NODE_TYPES.ExportNamedDeclaration,
  AST_NODE_TYPES.MethodDefinition,
  AST_NODE_TYPES.Property,
  AST_NODE_TYPES.PropertyDefinition,
]);

/**
 * Get the nearest preceding JSDoc comment for a node.
 * @param sourceCode - The source-code-like object to inspect.
 * @param node - The node to inspect.
 * @returns The nearest JSDoc comment, or null.
 */
export function getJsdocComment(
  sourceCode: Readonly<SourceCodeLike>,
  node: Readonly<TSESTree.Node>,
): TSESTree.Comment | null {
  const jsdocComments = sourceCode.getCommentsBefore(node).filter(isJsdocBlockComment);
  return jsdocComments[jsdocComments.length - 1] ?? null;
}

/**
 * Get the indentation prefix of the line containing a node.
 * @param sourceCode - The source-code-like object to inspect.
 * @param node - The node whose line should be inspected.
 * @returns The indentation prefix, or an empty string when location data is unavailable.
 */
export function getLineIndentation(sourceCode: Readonly<SourceCodeLike>, node: Readonly<TSESTree.Node>): string {
  const start = getNodeStart(node);
  if (start === null) {
    return "";
  }
  const lineText = sourceCode.lines[start.line - 1] ?? "";
  return lineText.slice(0, lineText.length - lineText.trimStart().length);
}

/**
 * Get a node start location when source locations are available.
 * @param node - The node to inspect.
 * @returns The node start location, or null when unavailable.
 */
function getNodeStart(node: Readonly<TSESTree.Node>): TSESTree.Position | null {
  return node.loc?.start ?? null;
}

/**
 * Get the parent node when it owns JSDoc placement for the given function.
 * @param node - The function-like node to inspect.
 * @returns The owning parent node, or null.
 */
export function getParentOwnedTargetNode(node: Readonly<FunctionNode>): TSESTree.Node | null {
  const parent = getRuntimeParent(node);
  return parent !== null && isParentOwnedTargetType(parent.type) ? parent : null;
}

/**
 * Read a runtime parent reference from a node.
 * @param node - The node whose parent should be read.
 * @returns The runtime parent node, or null.
 */
function getRuntimeParent(node: Readonly<TSESTree.Node>): TSESTree.Node | null {
  const parent: unknown = Reflect.get(node, "parent");
  return isNodeLike(parent) ? parent : null;
}

/**
 * Get the node that should own the JSDoc comment for a function.
 * @param node - The function-like node to inspect.
 * @returns The JSDoc owner node.
 */
export function getTargetNode(node: Readonly<FunctionNode>): TSESTree.Node {
  return getParentOwnedTargetNode(node) ?? getVariableOwnedTargetNode(node) ?? node;
}

/**
 * Resolve the owner node for a variable declarator that initializes a function.
 * @param declarator - The variable declarator owning the function initializer.
 * @returns The owning node for JSDoc placement.
 */
function getVariableOwnedTargetFromDeclarator(declarator: Readonly<TSESTree.VariableDeclarator>): TSESTree.Node {
  const declaration = getRuntimeParent(declarator);
  if (!isSingleVariableDeclaration(declaration)) {
    return declarator;
  }

  const declarationParent = getRuntimeParent(declaration);
  return isExportNamedDeclarationNode(declarationParent) ? declarationParent : declaration;
}

/**
 * Get the variable-related owner node for a function initializer.
 * @param node - The function-like node to inspect.
 * @returns The owning declaration node, declarator, or null.
 */
export function getVariableOwnedTargetNode(node: Readonly<FunctionNode>): TSESTree.Node | null {
  const parent = getRuntimeParent(node);
  if (!isVariableDeclarator(parent)) {
    return null;
  }

  return getVariableOwnedTargetFromDeclarator(parent);
}

/**
 * Check whether a node is an ExportNamedDeclaration.
 * @param node - The node to inspect.
 * @returns True when the node is ExportNamedDeclaration.
 */
function isExportNamedDeclarationNode(node: Readonly<TSESTree.Node> | null): node is TSESTree.ExportNamedDeclaration {
  return node?.type === AST_NODE_TYPES.ExportNamedDeclaration;
}

/**
 * Check whether a comment is a JSDoc block comment.
 * @param comment - The comment to inspect.
 * @returns True when the comment is a JSDoc block.
 */
export function isJsdocBlockComment(comment: Readonly<TSESTree.Comment>): boolean {
  return comment.type === BLOCK_COMMENT_TYPE && comment.value.startsWith(JSDOC_BLOCK_MARKER);
}

/**
 * Check whether a parent node type owns JSDoc placement.
 * @param type - The AST node type to inspect.
 * @returns True when the type owns JSDoc placement.
 */
export function isParentOwnedTargetType(type: Readonly<AST_NODE_TYPES>): boolean {
  return PARENT_OWNED_TARGET_TYPES.has(type);
}

/**
 * Check whether a node is a single-declarator variable declaration.
 * @param node - The node to inspect.
 * @returns True when node is a VariableDeclaration with one declarator.
 */
function isSingleVariableDeclaration(node: Readonly<TSESTree.Node> | null): node is TSESTree.VariableDeclaration {
  return node?.type === AST_NODE_TYPES.VariableDeclaration && node.declarations.length === 1;
}

/**
 * Check whether a node begins on its own line with only indentation before it.
 * @param sourceCode - The source-code-like object to inspect.
 * @param node - The node to inspect.
 * @returns True when the node starts on a standalone line and location data is available.
 */
export function isStandaloneLineTarget(sourceCode: Readonly<SourceCodeLike>, node: Readonly<TSESTree.Node>): boolean {
  const start = getNodeStart(node);
  if (start === null) {
    return false;
  }
  const lineText = sourceCode.lines[start.line - 1] ?? "";
  const prefix = lineText.slice(0, start.column);
  return prefix.trim().length === 0;
}
