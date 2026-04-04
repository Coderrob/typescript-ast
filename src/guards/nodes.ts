import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";

/**
 * Type guard for BlockStatement nodes.
 * @param node - The node to check.
 * @returns True if the node is a BlockStatement.
 */
export function isBlockStatement(node: TSESTree.Node | null | undefined): node is TSESTree.BlockStatement {
  return node?.type === AST_NODE_TYPES.BlockStatement;
}

/**
 * Type guard for CallExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a CallExpression.
 */
export function isCallExpression(node: TSESTree.Node | null | undefined): node is TSESTree.CallExpression {
  return node?.type === AST_NODE_TYPES.CallExpression;
}

/**
 * Type guard for function-like nodes (FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction).
 * @param node - The node to check.
 * @returns True if the node is a function-like node.
 */
export function isFunctionLike(
  node: TSESTree.Node | null | undefined
): node is TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | TSESTree.TSDeclareFunction {
  return (
    node?.type === AST_NODE_TYPES.FunctionDeclaration ||
    node?.type === AST_NODE_TYPES.FunctionExpression ||
    node?.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    node?.type === AST_NODE_TYPES.TSDeclareFunction
  );
}

/**
 * Type guard for Identifier nodes.
 * @param node - The node to check.
 * @returns True if the node is an Identifier.
 */
export function isIdentifier(node: TSESTree.Node | null | undefined): node is TSESTree.Identifier {
  return node?.type === AST_NODE_TYPES.Identifier;
}

/**
 * Type guard for Literal nodes.
 * @param node - The node to check.
 * @returns True if the node is a Literal.
 */
export function isLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.Literal {
  return node?.type === AST_NODE_TYPES.Literal;
}

/**
 * Type guard for MemberExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a MemberExpression.
 */
export function isMemberExpression(node: TSESTree.Node | null | undefined): node is TSESTree.MemberExpression {
  return node?.type === AST_NODE_TYPES.MemberExpression;
}

/**
 * Type guard for ReturnStatement nodes.
 * @param node - The node to check.
 * @returns True if the node is a ReturnStatement.
 */
export function isReturnStatement(node: TSESTree.Node | null | undefined): node is TSESTree.ReturnStatement {
  return node?.type === AST_NODE_TYPES.ReturnStatement;
}

/**
 * Type guard for string Literal nodes.
 * @param node - The node to check.
 * @returns True if the node is a string Literal.
 */
export function isStringLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.StringLiteral {
  if (!node || node.type !== AST_NODE_TYPES.Literal) return false;
  return typeof node.value === "string";
}

/**
 * Type guard for ThisExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a ThisExpression.
 */
export function isThisExpression(node: TSESTree.Node | null | undefined): node is TSESTree.ThisExpression {
  return node?.type === AST_NODE_TYPES.ThisExpression;
}

/**
 * Type guard for TSAsExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSAsExpression.
 */
export function isTSAsExpression(node: TSESTree.Node | null | undefined): node is TSESTree.TSAsExpression {
  return node?.type === AST_NODE_TYPES.TSAsExpression;
}

/**
 * Type guard for TSParameterProperty nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSParameterProperty.
 */
export function isTSParameterProperty(node: TSESTree.Node | null | undefined): node is TSESTree.TSParameterProperty {
  return node?.type === AST_NODE_TYPES.TSParameterProperty;
}

/**
 * Type guard for TSPropertySignature nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSPropertySignature.
 */
export function isTSPropertySignature(node: TSESTree.Node | null | undefined): node is TSESTree.TSPropertySignature {
  return node?.type === AST_NODE_TYPES.TSPropertySignature;
}

/**
 * Type guard for TSSatisfiesExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSSatisfiesExpression.
 */
export function isTSSatisfiesExpression(node: TSESTree.Node | null | undefined): node is TSESTree.TSSatisfiesExpression {
  return node?.type === AST_NODE_TYPES.TSSatisfiesExpression;
}

/**
 * Type guard for TSTypeAnnotation nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSTypeAnnotation.
 */
export function isTSTypeAnnotation(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeAnnotation {
  return node?.type === AST_NODE_TYPES.TSTypeAnnotation;
}

/**
 * Type guard for TSTypeLiteral nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSTypeLiteral.
 */
export function isTSTypeLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeLiteral {
  return node?.type === AST_NODE_TYPES.TSTypeLiteral;
}

/**
 * Type guard for TSTypeReference nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSTypeReference.
 */
export function isTSTypeReference(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeReference {
  return node?.type === AST_NODE_TYPES.TSTypeReference;
}
