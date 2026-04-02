import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";

/** Type guard for Identifier nodes */
export function isIdentifier(node: TSESTree.Node | null | undefined): node is TSESTree.Identifier {
  return node?.type === AST_NODE_TYPES.Identifier;
}

/** Type guard for MemberExpression nodes */
export function isMemberExpression(node: TSESTree.Node | null | undefined): node is TSESTree.MemberExpression {
  return node?.type === AST_NODE_TYPES.MemberExpression;
}

/** Type guard for CallExpression nodes */
export function isCallExpression(node: TSESTree.Node | null | undefined): node is TSESTree.CallExpression {
  return node?.type === AST_NODE_TYPES.CallExpression;
}

/** Type guard for Literal nodes */
export function isLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.Literal {
  return node?.type === AST_NODE_TYPES.Literal;
}

/** Type guard for string Literal nodes */
export function isStringLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.StringLiteral {
  return node?.type === AST_NODE_TYPES.Literal && typeof (node as TSESTree.Literal).value === "string";
}

/** Type guard for BlockStatement nodes */
export function isBlockStatement(node: TSESTree.Node | null | undefined): node is TSESTree.BlockStatement {
  return node?.type === AST_NODE_TYPES.BlockStatement;
}

/** Type guard for ReturnStatement nodes */
export function isReturnStatement(node: TSESTree.Node | null | undefined): node is TSESTree.ReturnStatement {
  return node?.type === AST_NODE_TYPES.ReturnStatement;
}

/** Type guard for function-like nodes (FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction) */
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

/** Type guard for TSParameterProperty nodes */
export function isTSParameterProperty(node: TSESTree.Node | null | undefined): node is TSESTree.TSParameterProperty {
  return node?.type === AST_NODE_TYPES.TSParameterProperty;
}

/** Type guard for TSTypeAnnotation nodes */
export function isTSTypeAnnotation(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeAnnotation {
  return node?.type === AST_NODE_TYPES.TSTypeAnnotation;
}

/** Type guard for TSTypeReference nodes */
export function isTSTypeReference(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeReference {
  return node?.type === AST_NODE_TYPES.TSTypeReference;
}

/** Type guard for TSTypeLiteral nodes */
export function isTSTypeLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeLiteral {
  return node?.type === AST_NODE_TYPES.TSTypeLiteral;
}

/** Type guard for TSPropertySignature nodes */
export function isTSPropertySignature(node: TSESTree.Node | null | undefined): node is TSESTree.TSPropertySignature {
  return node?.type === AST_NODE_TYPES.TSPropertySignature;
}

/** Type guard for TSAsExpression nodes */
export function isTSAsExpression(node: TSESTree.Node | null | undefined): node is TSESTree.TSAsExpression {
  return node?.type === AST_NODE_TYPES.TSAsExpression;
}

/** Type guard for TSSatisfiesExpression nodes */
export function isTSSatisfiesExpression(node: TSESTree.Node | null | undefined): node is TSESTree.TSSatisfiesExpression {
  return node?.type === AST_NODE_TYPES.TSSatisfiesExpression;
}

/** Type guard for ThisExpression nodes */
export function isThisExpression(node: TSESTree.Node | null | undefined): node is TSESTree.ThisExpression {
  return node?.type === AST_NODE_TYPES.ThisExpression;
}
