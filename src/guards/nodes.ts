import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";

export type FunctionNode =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.TSDeclareFunction;

const TEST_FILE_PATTERN = /\.(test|spec|e2e|integration)\.[cm]?[jt]sx?$/;
const TEST_DIRECTORY_SEGMENT = "/__tests__/";

/**
 * Type guard for BinaryExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a BinaryExpression.
 */
export function isBinaryExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.BinaryExpression {
  return node?.type === AST_NODE_TYPES.BinaryExpression;
}

/**
 * Type guard for BlockStatement nodes.
 * @param node - The node to check.
 * @returns True if the node is a BlockStatement.
 */
export function isBlockStatement(
  node: TSESTree.Node | null | undefined
): node is TSESTree.BlockStatement {
  return node?.type === AST_NODE_TYPES.BlockStatement;
}

/**
 * Type guard for CallExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a CallExpression.
 */
export function isCallExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.CallExpression {
  return node?.type === AST_NODE_TYPES.CallExpression;
}

/**
 * Type guard for FunctionDeclaration nodes.
 * @param node - The node to check.
 * @returns True if the node is a FunctionDeclaration.
 */
export function isFunctionDeclaration(
  node: TSESTree.Node | null | undefined
): node is TSESTree.FunctionDeclaration {
  return node?.type === AST_NODE_TYPES.FunctionDeclaration;
}

/**
 * Type guard for function-like nodes.
 * @param node - The node to check.
 * @returns True if the node is a supported function-like node.
 */
export function isFunctionLike(
  node: TSESTree.Node | null | undefined
): node is FunctionNode {
  return (
    node?.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    node?.type === AST_NODE_TYPES.FunctionDeclaration ||
    node?.type === AST_NODE_TYPES.FunctionExpression ||
    node?.type === AST_NODE_TYPES.TSDeclareFunction
  );
}

/**
 * Type guard for Identifier nodes.
 * @param node - The node to check.
 * @returns True if the node is an Identifier.
 */
export function isIdentifier(
  node: TSESTree.Node | null | undefined
): node is TSESTree.Identifier {
  return node?.type === AST_NODE_TYPES.Identifier;
}

/**
 * Type guard for a named Identifier node.
 * @param node - The node to check.
 * @param name - The expected name.
 * @returns True if the node is an Identifier with the given name.
 */
export function isNamedIdentifier(
  node: TSESTree.Node | null | undefined,
  name: string
): node is TSESTree.Identifier {
  return isIdentifier(node) && node.name === name;
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
export function isMemberExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.MemberExpression {
  return node?.type === AST_NODE_TYPES.MemberExpression;
}

/**
 * Type guard for MethodDefinition nodes.
 * @param node - The node to check.
 * @returns True if the node is a MethodDefinition.
 */
export function isMethodDefinition(
  node: TSESTree.Node | null | undefined
): node is TSESTree.MethodDefinition {
  return node?.type === AST_NODE_TYPES.MethodDefinition;
}

/**
 * Type guard for runtime node-like values.
 * @param value - The value to check.
 * @returns True if the value has a string `type` property.
 */
export function isNodeLike(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && "type" in value && typeof Reflect.get(value, "type") === "string";
}

/**
 * Type guard for ReturnStatement nodes.
 * @param node - The node to check.
 * @returns True if the node is a ReturnStatement.
 */
export function isReturnStatement(
  node: TSESTree.Node | null | undefined
): node is TSESTree.ReturnStatement {
  return node?.type === AST_NODE_TYPES.ReturnStatement;
}

/**
 * Type guard for string Literal nodes.
 * @param node - The node to check.
 * @returns True if the node is a string Literal.
 */
export function isStringLiteral(
  node: TSESTree.Node | null | undefined
): node is TSESTree.StringLiteral {
  return isLiteral(node) && typeof node.value === "string";
}

/**
 * Type guard for SwitchCase nodes.
 * @param node - The node to check.
 * @returns True if the node is a SwitchCase.
 */
export function isSwitchCase(
  node: TSESTree.Node | null | undefined
): node is TSESTree.SwitchCase {
  return node?.type === AST_NODE_TYPES.SwitchCase;
}

/**
 * Type guard for ThisExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a ThisExpression.
 */
export function isThisExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.ThisExpression {
  return node?.type === AST_NODE_TYPES.ThisExpression;
}

/**
 * Type guard for TSEnumMember nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSEnumMember.
 */
export function isTSEnumMember(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSEnumMember {
  return node?.type === AST_NODE_TYPES.TSEnumMember;
}

/**
 * Type guard for TSAsExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSAsExpression.
 */
export function isTSAsExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSAsExpression {
  return node?.type === AST_NODE_TYPES.TSAsExpression;
}

/**
 * Type guard for TSNonNullExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSNonNullExpression.
 */
export function isTSNonNullExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSNonNullExpression {
  return node?.type === AST_NODE_TYPES.TSNonNullExpression;
}

/**
 * Type guard for TSParameterProperty nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSParameterProperty.
 */
export function isTSParameterProperty(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSParameterProperty {
  return node?.type === AST_NODE_TYPES.TSParameterProperty;
}

/**
 * Type guard for TSPropertySignature nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSPropertySignature.
 */
export function isTSPropertySignature(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSPropertySignature {
  return node?.type === AST_NODE_TYPES.TSPropertySignature;
}

/**
 * Type guard for TSSatisfiesExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSSatisfiesExpression.
 */
export function isTSSatisfiesExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSSatisfiesExpression {
  return node?.type === AST_NODE_TYPES.TSSatisfiesExpression;
}

/**
 * Type guard for TSTypeAnnotation nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSTypeAnnotation.
 */
export function isTSTypeAnnotation(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSTypeAnnotation {
  return node?.type === AST_NODE_TYPES.TSTypeAnnotation;
}

/**
 * Type guard for TSTypeLiteral nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSTypeLiteral.
 */
export function isTSTypeLiteral(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSTypeLiteral {
  return node?.type === AST_NODE_TYPES.TSTypeLiteral;
}

/**
 * Type guard for TSTypeReference nodes.
 * @param node - The node to check.
 * @returns True if the node is a TSTypeReference.
 */
export function isTSTypeReference(
  node: TSESTree.Node | null | undefined
): node is TSESTree.TSTypeReference {
  return node?.type === AST_NODE_TYPES.TSTypeReference;
}

/**
 * Type guard for UnaryExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a UnaryExpression.
 */
export function isUnaryExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.UnaryExpression {
  return node?.type === AST_NODE_TYPES.UnaryExpression;
}

/**
 * Type guard for non-computed MemberExpression nodes.
 * @param node - The node to check.
 * @returns True if the node is a non-computed MemberExpression.
 */
export function isUncomputedMemberExpression(
  node: TSESTree.Node | null | undefined
): node is TSESTree.MemberExpression & {
  computed: false;
  object: TSESTree.Expression;
  property: TSESTree.Expression | TSESTree.PrivateIdentifier;
} {
  return isMemberExpression(node) && !node.computed;
}

/**
 * Type guard for VariableDeclaration nodes.
 * @param node - The node to check.
 * @returns True if the node is a VariableDeclaration.
 */
export function isVariableDeclaration(
  node: TSESTree.Node | null | undefined
): node is TSESTree.VariableDeclaration {
  return node?.type === AST_NODE_TYPES.VariableDeclaration;
}

/**
 * Type guard for VariableDeclarator nodes.
 * @param node - The node to check.
 * @returns True if the node is a VariableDeclarator.
 */
export function isVariableDeclarator(
  node: TSESTree.Node | null | undefined
): node is TSESTree.VariableDeclarator {
  return node?.type === AST_NODE_TYPES.VariableDeclarator;
}

/**
 * Check whether a file path matches common test-file conventions.
 * @param filename - The file path to inspect.
 * @returns True if the file is a test file.
 */
export function isTestFile(filename: string): boolean {
  const normalizedFilename = filename.replace(/\\/g, "/").toLowerCase();
  return normalizedFilename.includes(TEST_DIRECTORY_SEGMENT) || TEST_FILE_PATTERN.test(normalizedFilename);
}

export const isBinaryExpressionNode = isBinaryExpression;
export const isBlockStatementNode = isBlockStatement;
export const isCallExpressionNode = isCallExpression;
export const isFunctionDeclarationNode = isFunctionDeclaration;
export const isIdentifierNode = isIdentifier;
export const isMemberExpressionNode = isMemberExpression;
export const isMethodDefinitionNode = isMethodDefinition;
export const isNamedIdentifierNode = isNamedIdentifier;
export const isSwitchCaseNode = isSwitchCase;
export const isTSEnumMemberNode = isTSEnumMember;
export const isUnaryExpressionNode = isUnaryExpression;
export const isUncomputedMemberExpressionNode = isUncomputedMemberExpression;
export const isVariableDeclarationNode = isVariableDeclaration;
export const isVariableDeclaratorNode = isVariableDeclarator;
