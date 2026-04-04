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
 * @param node - The TSTypeReference node to inspect.
 * @returns The type name string, or null if not an identifier.
 */
export function getTypeReferenceName(node: Readonly<TSESTree.TSTypeReference>): string | null {
  if (isIdentifier(node.typeName)) return node.typeName.name;
  return null;
}

/**
 * Check if a TSTypeLiteral has all readonly property members.
 * @param node - The TSTypeLiteral node to inspect.
 * @returns True if all members are readonly property signatures.
 */
export function hasAllReadonlyPropertyMembers(node: Readonly<TSESTree.TSTypeLiteral>): boolean {
  return node.members.every(isReadonlyPropertyMember);
}

/**
 * Check if a TSTypeReference has type arguments.
 * @param node - The TSTypeReference node to inspect.
 * @returns True if the type reference has at least one type argument.
 */
export function hasTypeArguments(node: Readonly<TSESTree.TSTypeReference>): boolean {
  return (node.typeArguments?.params.length ?? 0) > 0;
}

/**
 * Check if a node is a TSTypeReference with the given name.
 * @param node - The node to check.
 * @param name - The expected type reference name.
 * @returns True if the node is a TSTypeReference with the given name.
 */
export function isNamedTypeReference(
  node: TSESTree.Node | null | undefined,
  name: string
): node is TSESTree.TSTypeReference {
  return isTSTypeReference(node) && getTypeReferenceName(node) === name;
}

/**
 * Check if a type member is a readonly property signature.
 * @param member - The type element to check.
 * @returns True if the member is a readonly TSPropertySignature.
 */
function isReadonlyPropertyMember(member: Readonly<TSESTree.TypeElement>): boolean {
  return isTSPropertySignature(member) && !!member.readonly;
}

/**
 * Unwrap TSAsExpression or TSSatisfiesExpression to the inner expression.
 * @param expression - The expression to unwrap.
 * @returns The innermost non-wrapping expression.
 */
export function unwrapTsExpression(
  expression: Readonly<TSESTree.Expression>
): TSESTree.Expression {
  let current = expression;
  while (isTSAsExpression(current) || isTSSatisfiesExpression(current)) {
    current = current.expression;
  }
  return current;
}
