import { TSESTree } from "@typescript-eslint/types";
import {
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isStringLiteral,
} from "../guards/nodes";
import { getCallMemberMethodName, getMemberPropertyName } from "./helpers";

/**
 * Get a call expression argument by index.
 * @param node - The call expression to inspect.
 * @param index - The zero-based argument index.
 * @returns The argument node, or null.
 */
export function getCallArgument(
  node: Readonly<TSESTree.CallExpression>,
  index: number
): TSESTree.CallExpressionArgument | null {
  return node.arguments[index] ?? null;
}

/**
 * Get the dotted name path from a callee expression (e.g., "foo.bar.baz").
 * @param callee - The callee expression to extract the name path from.
 * @returns The dotted name string, or null if it cannot be determined.
 */
export function getCalleeNamePath(callee: Readonly<TSESTree.Node>): string | null {
  const segments = getCalleeNameSegments(callee);
  return segments === null ? null : segments.join(".");
}

/**
 * Get the static name segments for a callee expression.
 * @param callee - The callee expression to inspect.
 * @returns The ordered callee segments, or null if unresolved.
 */
function getCalleeNameSegments(callee: Readonly<TSESTree.Node>): string[] | null {
  if (isIdentifier(callee)) {
    return [callee.name];
  }
  if (isCallExpression(callee)) {
    return getCalleeNameSegments(callee.callee);
  }
  if (!isMemberExpression(callee)) {
    return null;
  }

  const propertyName = getMemberPropertyName(callee);
  const objectPath = getCalleeNameSegments(callee.object);
  return propertyName === null || objectPath === null ? null : [...objectPath, propertyName];
}

/**
 * Get the first argument of a call expression.
 * @param node - The call expression node.
 * @returns The first argument node, or null if none.
 */
export function getFirstCallArgument(
  node: Readonly<TSESTree.CallExpression>
): TSESTree.CallExpressionArgument | null {
  return getCallArgument(node, 0);
}

/**
 * Get a matching member method name when the callee is a member call.
 * @param node - The call expression to inspect.
 * @param names - The allowed method names.
 * @returns The matched method name, or null.
 */
export function getMatchingCallMemberMethodName(
  node: Readonly<TSESTree.CallExpression>,
  names: Readonly<ReadonlySet<string>>
): string | null {
  const methodName = getCallMemberMethodName(node);
  return methodName !== null && names.has(methodName) ? methodName : null;
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
  const argument = getCallArgument(node, index);
  if (!argument || !isStringLiteral(argument)) {
    return null;
  }
  return argument.value;
}

/**
 * Check whether a call expression matches a resolved callee path.
 * @param node - The call expression to inspect.
 * @param expectedPath - The expected callee path segments.
 * @returns True when the callee path matches exactly.
 */
export function hasCallCalleeNamePath(
  node: Readonly<TSESTree.CallExpression>,
  expectedPath: ReadonlyArray<string>
): boolean {
  const actualPath = getCalleeNameSegments(node.callee);
  return actualPath !== null && hasMatchingNamePath(actualPath, expectedPath);
}

/**
 * Check if a call expression has a simple identifier callee with the given name.
 * @param node - The call expression node.
 * @param name - The expected callee name.
 * @returns True if the callee is an identifier matching the given name.
 */
export function hasIdentifierCallee(
  node: Readonly<TSESTree.CallExpression>,
  name: string
): boolean {
  return isIdentifier(node.callee) && node.callee.name === name;
}

/**
 * Check whether two callee paths match exactly.
 * @param actualPath - The resolved callee path.
 * @param expectedPath - The expected callee path.
 * @returns True when both paths match by segment and length.
 */
function hasMatchingNamePath(
  actualPath: ReadonlyArray<string>,
  expectedPath: ReadonlyArray<string>
): boolean {
  if (actualPath.length !== expectedPath.length) {
    return false;
  }
  return actualPath.length === 0
    ? true
    : actualPath[0] === expectedPath[0] &&
        hasMatchingNamePath(actualPath.slice(1), expectedPath.slice(1));
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
  return (isIdentifier(callee) || isMemberExpression(callee) || isCallExpression(callee)) &&
    getCalleeNamePath(callee) === name;
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
  if (!isMemberExpression(node.callee) || node.callee.computed) return false;
  const obj = node.callee.object;
  const prop = node.callee.property;
  return isIdentifier(obj) && obj.name === objectName &&
    isIdentifier(prop) && prop.name === propertyName;
}
