import { TSESTree } from "@typescript-eslint/types";
import {
  isIdentifier,
  isTSPropertySignature,
  isTSAsExpression,
  isTSSatisfiesExpression,
  isTSTypeReference,
} from "../guards/nodes";

/**
 * Get the name string from a TSTypeReference node.
 */
export function getTypeReferenceName(node: TSESTree.TSTypeReference): string | null {
  if (isIdentifier(node.typeName)) return node.typeName.name;
  return null;
}

/**
 * Check if a TSTypeReference has type arguments.
 */
export function hasTypeArguments(node: TSESTree.TSTypeReference): boolean {
  return !!(node.typeArguments && node.typeArguments.params.length > 0);
}

/**
 * Check if a TSTypeLiteral has all readonly property members.
 */
export function hasAllReadonlyPropertyMembers(node: TSESTree.TSTypeLiteral): boolean {
  return node.members.every(
    (member) => isTSPropertySignature(member) && member.readonly === true
  );
}

/**
 * Unwrap TSAsExpression or TSSatisfiesExpression to the inner expression.
 */
export function unwrapTsExpression(
  expression: TSESTree.Expression
): TSESTree.Expression {
  let current = expression;
  while (isTSAsExpression(current) || isTSSatisfiesExpression(current)) {
    current = current.expression;
  }
  return current;
}

/**
 * Check if a node is a TSTypeReference with the given name.
 */
export function isNamedTypeReference(
  node: TSESTree.Node | null | undefined,
  name: string
): node is TSESTree.TSTypeReference {
  return isTSTypeReference(node) && getTypeReferenceName(node) === name;
}
