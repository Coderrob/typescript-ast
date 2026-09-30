import { TSESTree } from "@typescript-eslint/types";
import {
  isIdentifier,
  isTSAsExpression,
  isTSNonNullExpression,
  isTSPropertySignature,
  isTSSatisfiesExpression,
  isTSTypeReference,
} from "../guards/nodes";

type TsWrappingExpression = TSESTree.TSAsExpression | TSESTree.TSNonNullExpression | TSESTree.TSSatisfiesExpression;

/**
 * Get the first type argument from a type reference.
 * @param node - The type reference to inspect.
 * @returns The first type argument, or null.
 */
export function getFirstTypeArgument(node: Readonly<TSESTree.TSTypeReference>): TSESTree.TypeNode | null {
  return node.typeArguments?.params[0] ?? null;
}

/**
 * Get the name string from a TSTypeReference node.
 * @param node - The TSTypeReference node to inspect.
 * @returns The type name string, or null if not an identifier.
 */
export function getTypeReferenceName(node: Readonly<TSESTree.TSTypeReference>): string | null {
  return isIdentifier(node.typeName) ? node.typeName.name : null;
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
 * Check whether a named type reference has at least one type argument.
 * @param node - The type reference to inspect.
 * @param expectedName - The expected type reference name.
 * @returns True when the type reference matches the name and has type arguments.
 */
export function hasNamedTypeReferenceWithTypeArguments(
  node: Readonly<TSESTree.TSTypeReference>,
  expectedName: string,
): boolean {
  return isNamedTypeReference(node, expectedName) && hasTypeArguments(node);
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
  name: string,
): node is TSESTree.TSTypeReference {
  return isTSTypeReference(node) && getTypeReferenceName(node) === name;
}

/**
 * Check whether a type element is a readonly property signature.
 * @param member - The type element to inspect.
 * @returns True when the member is a readonly property signature.
 */
function isReadonlyPropertyMember(member: Readonly<TSESTree.TypeElement>): boolean {
  return isTSPropertySignature(member) && !!member.readonly;
}

/**
 * Check whether an expression is a TS wrapper expression.
 * @param expression - The expression to inspect.
 * @returns True when the expression wraps another runtime expression.
 */
function isTsWrappingExpression(expression: Readonly<TSESTree.Expression>): expression is TsWrappingExpression {
  return isTSAsExpression(expression) || isTSNonNullExpression(expression) || isTSSatisfiesExpression(expression);
}

/**
 * Unwrap TS wrapper expressions to the underlying runtime expression.
 * @param expression - The expression to unwrap.
 * @returns The innermost non-wrapping expression.
 */
export function unwrapTsExpression(expression: Readonly<TSESTree.Expression>): TSESTree.Expression {
  let current = expression;
  while (isTsWrappingExpression(current)) {
    current = current.expression;
  }
  return current;
}
