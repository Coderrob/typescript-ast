import { TSESTree } from "@typescript-eslint/types";
import { isIdentifier, isMemberExpression, isStringLiteral } from "../guards/nodes";

/**
 * Get the dotted name path from a callee expression (e.g., "foo.bar.baz").
 * @param callee - The callee expression to extract the name path from.
 * @returns The dotted name string, or null if it cannot be determined.
 */
export function getCalleeNamePath(callee: Readonly<TSESTree.Node>): string | null {
  if (isIdentifier(callee)) return callee.name;
  if (!isMemberExpression(callee) || callee.computed) return null;
  const obj = callee.object;
  if (isIdentifier(obj) || isMemberExpression(obj)) {
    const objPath = getCalleeNamePath(obj);
    const prop = isIdentifier(callee.property) ? callee.property.name : null;
    if (objPath && prop) return `${objPath}.${prop}`;
  }
  return null;
}

/**
 * Get the first argument of a call expression.
 * @param node - The call expression node.
 * @returns The first argument node, or null if none.
 */
export function getFirstCallArgument(node: Readonly<TSESTree.CallExpression>): TSESTree.Node | null {
  return node.arguments[0] ?? null;
}

/**
 * Get the string literal argument at the given index.
 * @param node - The call expression node.
 * @param index - The argument index to retrieve.
 * @returns The string value if the argument is a string literal, otherwise null.
 */
export function getStringLiteralCallArgument(
  node: Readonly<TSESTree.CallExpression>,
  index: number
): string | null {
  const arg = node.arguments[index];
  if (!arg) return null;
  if (isStringLiteral(arg)) return arg.value;
  return null;
}

/**
 * Check if a call expression has a simple identifier callee with the given name.
 * @param node - The call expression node.
 * @param name - The expected callee name.
 * @returns True if the callee is an identifier matching the given name.
 */
export function hasIdentifierCallee(node: Readonly<TSESTree.CallExpression>, name: string): boolean {
  return isIdentifier(node.callee) && node.callee.name === name;
}

/**
 * Check if a call expression has a MemberExpression callee.
 * @param node - The call expression node.
 * @returns True if the callee is a MemberExpression.
 */
export function hasMemberCallee(node: Readonly<TSESTree.CallExpression>): boolean {
  return isMemberExpression(node.callee);
}

/**
 * Check if a call expression is to a named function.
 * @param node - The call expression node.
 * @param name - The expected dotted name path.
 * @returns True if the callee name path matches the given name.
 */
export function isNamedCall(node: Readonly<TSESTree.CallExpression>, name: string): boolean {
  const callee = node.callee;
  if (isIdentifier(callee) || isMemberExpression(callee)) {
    return getCalleeNamePath(callee) === name;
  }
  return false;
}

/**
 * Check if a call expression is to a named method on an object (e.g., object.method).
 * @param node - The call expression node.
 * @param objectName - The expected object identifier name.
 * @param propertyName - The expected property identifier name.
 * @returns True if the callee matches object.property.
 */
export function isNamedMemberCall(
  node: Readonly<TSESTree.CallExpression>,
  objectName: string,
  propertyName: string
): boolean {
  if (!isMemberExpression(node.callee)) return false;
  const obj = node.callee.object;
  const prop = node.callee.property;
  return isIdentifier(obj) && obj.name === objectName &&
    isIdentifier(prop) && prop.name === propertyName;
}
