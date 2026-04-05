import { TSESTree } from "@typescript-eslint/types";
import { isCallExpression, isIdentifier, isMemberExpression, isStringLiteral } from "../guards/nodes";
import { getCallMemberMethodName, getMemberPropertyName } from "./helpers";

/**
 * Append a property segment to a resolved object path.
 * @param objectPath - The resolved object path.
 * @param propertyName - The property name to append.
 * @returns The combined path, or null when the object path is unresolved.
 */
function appendPropertyNameSegment(objectPath: ReadonlyArray<string> | null, propertyName: string): string[] | null {
  if (objectPath === null) {
    return null;
  }

  return [...objectPath, propertyName];
}

/**
 * Get a call expression argument by index.
 * @param node - The call expression to inspect.
 * @param index - The zero-based argument index.
 * @returns The argument node, or null.
 */
export function getCallArgument(
  node: Readonly<TSESTree.CallExpression>,
  index: number,
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
    return getCalleeNameSegmentsWithoutTopLevelCall(callee.callee);
  }

  return getMemberCalleeNameSegments(callee);
}

/**
 * Get callee name segments without allowing nested call-expression segments.
 * @param callee - The callee expression to inspect.
 * @returns The ordered segments, or null when unresolved.
 */
function getCalleeNameSegmentsWithoutTopLevelCall(callee: Readonly<TSESTree.Node>): string[] | null {
  if (isIdentifier(callee)) {
    return [callee.name];
  }

  if (isCallExpression(callee)) {
    return null;
  }

  return getMemberCalleeNameSegments(callee);
}

/**
 * Get the first argument of a call expression.
 * @param node - The call expression node.
 * @returns The first argument node, or null if none.
 */
export function getFirstCallArgument(node: Readonly<TSESTree.CallExpression>): TSESTree.CallExpressionArgument | null {
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
  names: Readonly<ReadonlySet<string>>,
): string | null {
  const methodName = getCallMemberMethodName(node);
  return methodName !== null && names.has(methodName) ? methodName : null;
}

/**
 * Narrow a node to a member-expression callee when possible.
 * @param callee - The callee node to inspect.
 * @returns The member-expression callee, or null.
 */
function getMemberCallee(callee: Readonly<TSESTree.Node>): TSESTree.MemberExpression | null {
  return isMemberExpression(callee) ? callee : null;
}

/**
 * Get callee name segments from a member-expression callee.
 * @param callee - The member-expression-like callee node.
 * @returns The ordered segments, or null when unresolved.
 */
function getMemberCalleeNameSegments(callee: Readonly<TSESTree.Node>): string[] | null {
  const memberCallee = getMemberCallee(callee);
  if (memberCallee === null) {
    return null;
  }

  const propertyName = getResolvedMemberPropertyName(memberCallee);
  if (propertyName === null) {
    return null;
  }

  const objectPath = getCalleeNameSegmentsWithoutTopLevelCall(memberCallee.object);
  return appendPropertyNameSegment(objectPath, propertyName);
}

/**
 * Resolve a member-expression property name.
 * @param callee - The member-expression callee.
 * @returns The resolved property name, or null.
 */
function getResolvedMemberPropertyName(callee: Readonly<TSESTree.MemberExpression>): string | null {
  return getMemberPropertyName(callee);
}

/**
 * Get the string literal argument at the given index.
 * @param node - The call expression node.
 * @param index - The argument index to retrieve.
 * @returns The string value if the argument is a string literal, otherwise null.
 */
export function getStringLiteralCallArgument(node: Readonly<TSESTree.CallExpression>, index: number): string | null {
  const argument = getCallArgument(node, index);
  if (!argument || !isStringLiteral(argument)) {
    return null;
  }
  return argument.value;
}

/**
 * Get a non-computed member-expression callee, if present.
 * @param node - The call expression to inspect.
 * @returns The non-computed member callee, or null.
 */
function getUncomputedMemberCallee(
  node: Readonly<TSESTree.CallExpression>,
): (TSESTree.MemberExpression & { computed: false }) | null {
  return isMemberExpression(node.callee) && !node.callee.computed ? node.callee : null;
}

/**
 * Check whether a call expression matches a resolved callee path.
 * @param node - The call expression to inspect.
 * @param expectedPath - The expected callee path segments.
 * @returns True when the callee path matches exactly.
 */
export function hasCallCalleeNamePath(
  node: Readonly<TSESTree.CallExpression>,
  expectedPath: ReadonlyArray<string>,
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
export function hasIdentifierCallee(node: Readonly<TSESTree.CallExpression>, name: string): boolean {
  return isIdentifier(node.callee) && node.callee.name === name;
}

/**
 * Check whether two callee paths match exactly.
 * @param actualPath - The resolved callee path.
 * @param expectedPath - The expected callee path.
 * @returns True when both paths match by segment and length.
 */
function hasMatchingNamePath(actualPath: ReadonlyArray<string>, expectedPath: ReadonlyArray<string>): boolean {
  return hasMatchingPathLength(actualPath, expectedPath) && hasMatchingPathSegments(actualPath, expectedPath);
}

/**
 * Check whether actual and expected path lengths match.
 * @param actualPath - The resolved callee path.
 * @param expectedPath - The expected callee path.
 * @returns True when path lengths match.
 */
function hasMatchingPathLength(actualPath: ReadonlyArray<string>, expectedPath: ReadonlyArray<string>): boolean {
  return actualPath.length === expectedPath.length;
}

/**
 * Check whether all path segments match by index.
 * @param actualPath - The resolved callee path.
 * @param expectedPath - The expected callee path.
 * @returns True when all segments match.
 */
function hasMatchingPathSegments(actualPath: ReadonlyArray<string>, expectedPath: ReadonlyArray<string>): boolean {
  for (const [index, segment] of actualPath.entries()) {
    if (segment !== expectedPath[index]) {
      return false;
    }
  }

  return true;
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
 * Check whether a member expression has the expected object identifier name.
 * @param callee - The member expression to inspect.
 * @param objectName - The expected object identifier name.
 * @returns True when the object name matches.
 */
function hasNamedMemberObject(callee: Readonly<TSESTree.MemberExpression>, objectName: string): boolean {
  return isIdentifier(callee.object) && callee.object.name === objectName;
}

/**
 * Check whether a member expression has the expected object/property identifier names.
 * @param callee - The member expression to inspect.
 * @param objectName - The expected object identifier name.
 * @param propertyName - The expected property identifier name.
 * @returns True when object and property names both match.
 */
function hasNamedMemberObjectAndProperty(
  callee: Readonly<TSESTree.MemberExpression>,
  objectName: string,
  propertyName: string,
): boolean {
  if (!hasNamedMemberObject(callee, objectName)) {
    return false;
  }

  return hasNamedMemberProperty(callee, propertyName);
}

/**
 * Check whether a member expression has the expected property identifier name.
 * @param callee - The member expression to inspect.
 * @param propertyName - The expected property identifier name.
 * @returns True when the property name matches.
 */
function hasNamedMemberProperty(callee: Readonly<TSESTree.MemberExpression>, propertyName: string): boolean {
  return isIdentifier(callee.property) && callee.property.name === propertyName;
}

/**
 * Check if a call expression is to a named function.
 * @param node - The call expression node.
 * @param name - The expected dotted name path.
 * @returns True if the callee is an identifier or member expression whose name path matches the given name.
 */
export function isNamedCall(node: Readonly<TSESTree.CallExpression>, name: string): boolean {
  const callee = node.callee;
  return (isIdentifier(callee) || isMemberExpression(callee)) && getCalleeNamePath(callee) === name;
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
  propertyName: string,
): boolean {
  const callee = getUncomputedMemberCallee(node);
  return callee !== null && hasNamedMemberObjectAndProperty(callee, objectName, propertyName);
}
