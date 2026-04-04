import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { FunctionNode, isNodeLike, isVariableDeclarator } from "../guards/nodes";

type SourceCodeLike = {
  readonly lines: readonly string[];
  getCommentsBefore(node: Readonly<TSESTree.Node>): readonly TSESTree.Comment[];
};

const JSDOC_BLOCK_MARKER = "*";

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
  node: Readonly<TSESTree.Node>
): TSESTree.Comment | null {
  const jsdocComments = sourceCode.getCommentsBefore(node).filter(isJsdocBlockComment);
  return jsdocComments[jsdocComments.length - 1] ?? null;
}

/**
 * Get the indentation prefix of the line containing a node.
 * @param sourceCode - The source-code-like object to inspect.
 * @param node - The node whose line should be inspected.
 * @returns The indentation prefix.
 */
export function getLineIndentation(
  sourceCode: Readonly<SourceCodeLike>,
  node: Readonly<TSESTree.Node>
): string {
  const lineText = sourceCode.lines[node.loc.start.line - 1] ?? "";
  return lineText.slice(0, lineText.length - lineText.trimStart().length);
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
 * Get the node that should own the JSDoc comment for a function.
 * @param node - The function-like node to inspect.
 * @returns The JSDoc owner node.
 */
export function getTargetNode(node: Readonly<FunctionNode>): TSESTree.Node {
  return getParentOwnedTargetNode(node) ?? getVariableOwnedTargetNode(node) ?? node;
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

  const declaration = getRuntimeParent(parent);
  if (declaration?.type !== AST_NODE_TYPES.VariableDeclaration) {
    return parent;
  }
  if (declaration.declarations.length !== 1) {
    return parent;
  }

  const declarationParent = getRuntimeParent(declaration);
  return declarationParent?.type === AST_NODE_TYPES.ExportNamedDeclaration
    ? declarationParent
    : declaration;
}

/**
 * Check whether a comment is a JSDoc block comment.
 * @param comment - The comment to inspect.
 * @returns True when the comment is a JSDoc block.
 */
export function isJsdocBlockComment(comment: Readonly<TSESTree.Comment>): boolean {
  return comment.type === "Block" && comment.value.startsWith(JSDOC_BLOCK_MARKER);
}

/**
 * Check whether a parent node type owns JSDoc placement.
 * @param type - The AST node type to inspect.
 * @returns True when the type owns JSDoc placement.
 */
export function isParentOwnedTargetType(type: AST_NODE_TYPES): boolean {
  return PARENT_OWNED_TARGET_TYPES.has(type);
}

/**
 * Check whether a node begins on its own line with only indentation before it.
 * @param sourceCode - The source-code-like object to inspect.
 * @param node - The node to inspect.
 * @returns True when the node starts on a standalone line.
 */
export function isStandaloneLineTarget(
  sourceCode: Readonly<SourceCodeLike>,
  node: Readonly<TSESTree.Node>
): boolean {
  const lineText = sourceCode.lines[node.loc.start.line - 1] ?? "";
  const prefix = lineText.slice(0, node.loc.start.column);
  return prefix.trim().length === 0;
}

function getRuntimeParent(node: Readonly<TSESTree.Node>): TSESTree.Node | null {
  const parent: unknown = Reflect.get(node, "parent");
  return isNodeLike(parent) ? parent : null;
}
