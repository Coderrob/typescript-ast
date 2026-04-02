import { TSESTree } from "@typescript-eslint/types";
import { isIdentifier, isMemberExpression, isStringLiteral } from "../guards/nodes";

/**
 * Get the dotted name path from a callee expression (e.g., "foo.bar.baz").
 */
export function getCalleeNamePath(callee: TSESTree.LeftHandSideExpression): string | null {
  if (isIdentifier(callee)) return callee.name;
  if (isMemberExpression(callee) && !callee.computed) {
    const obj = getCalleeNamePath(callee.object as TSESTree.LeftHandSideExpression);
    const prop = isIdentifier(callee.property) ? callee.property.name : null;
    if (obj && prop) return `${obj}.${prop}`;
  }
  return null;
}

/**
 * Check if a call expression has a simple identifier callee with the given name.
 */
export function hasIdentifierCallee(node: TSESTree.CallExpression, name: string): boolean {
  return isIdentifier(node.callee) && node.callee.name === name;
}

/**
 * Check if a call expression has a MemberExpression callee.
 */
export function hasMemberCallee(node: TSESTree.CallExpression): boolean {
  return isMemberExpression(node.callee);
}

/**
 * Check if a call expression is to a named function.
 */
export function isNamedCall(node: TSESTree.CallExpression, name: string): boolean {
  return getCalleeNamePath(node.callee as TSESTree.LeftHandSideExpression) === name;
}

/**
 * Check if a call expression is to a named method on an object (e.g., object.method).
 */
export function isNamedMemberCall(
  node: TSESTree.CallExpression,
  objectName: string,
  propertyName: string
): boolean {
  if (!isMemberExpression(node.callee)) return false;
  const obj = node.callee.object;
  const prop = node.callee.property;
  return isIdentifier(obj) && obj.name === objectName &&
    isIdentifier(prop) && prop.name === propertyName;
}

/**
 * Get the first argument of a call expression.
 */
export function getFirstCallArgument(node: TSESTree.CallExpression): TSESTree.Node | null {
  return node.arguments[0] ?? null;
}

/**
 * Get the string literal argument at the given index.
 */
export function getStringLiteralCallArgument(
  node: TSESTree.CallExpression,
  index: number
): string | null {
  const arg = node.arguments[index];
  if (!arg) return null;
  if (isStringLiteral(arg)) return arg.value as string;
  return null;
}
