import { TSESTree } from "@typescript-eslint/types";
import {
  FunctionNode,
  isFunctionDeclaration,
  isIdentifier,
  isMemberExpression,
  isMethodDefinition,
  isNodeLike,
  isVariableDeclarator,
} from "../guards/nodes";
import { isPlainObject, isString } from "../guards/values";

const ANONYMOUS_FUNCTION_NAME = "<anonymous>";

type MemberExpressionLike = {
  readonly computed: boolean;
  readonly property: {
    readonly type: string;
    readonly name?: string;
    readonly value?: unknown;
  };
};

type SourceCodeVisitorKeysLike = {
  readonly visitorKeys: Readonly<Record<string, readonly string[] | undefined>>;
};

/**
 * Get the member method name for a call expression.
 * @param node - The call expression to inspect.
 * @returns The resolved member method name, or null.
 */
export function getCallMemberMethodName(node: Readonly<TSESTree.CallExpression>): string | null {
  return isMemberExpression(node.callee) ? getMemberPropertyName(node.callee) : null;
}

/**
 * Get the declared name of a function declaration.
 * @param node - The function-like node to inspect.
 * @returns The declaration name, or null.
 */
export function getFunctionDeclarationName(node: Readonly<FunctionNode>): string | null {
  return isFunctionDeclaration(node) ? getIdentifierName(node.id) : null;
}

/**
 * Get the enclosing method name for a function node.
 * @param node - The function-like node to inspect.
 * @returns The method name, or null.
 */
export function getFunctionMethodName(node: Readonly<FunctionNode>): string | null {
  const parent = getRuntimeParent(node);
  return isMethodDefinition(parent) ? getIdentifierName(parent.key) : null;
}

/**
 * Get the variable name when a function is assigned as an initializer.
 * @param node - The function-like node to inspect.
 * @returns The variable name, or null.
 */
export function getFunctionVariableName(node: Readonly<FunctionNode>): string | null {
  const parent = getRuntimeParent(node);
  return isVariableDeclarator(parent) ? getIdentifierName(parent.id) : null;
}

/**
 * Get an identifier name from a node.
 * @param node - The node to inspect.
 * @returns The identifier name, or null.
 */
export function getIdentifierName(node: Readonly<TSESTree.Node> | null | undefined): string | null {
  return isIdentifier(node) ? node.name : null;
}

/**
 * Get a string value from a literal-like node.
 * @param node - The node to inspect.
 * @returns The string literal value, or null.
 */
export function getLiteralStringValue(
  node: Readonly<{ type: string; value?: unknown }> | null | undefined
): string | null {
  return node?.type === "Literal" && isString(node.value) ? node.value : null;
}

/**
 * Resolve a mapped replacement for a member property.
 * @param node - The member expression-like node to inspect.
 * @param replacements - A lookup of property replacements.
 * @returns The matched property name and replacement, or null.
 */
export function getMappedMemberPropertyName(
  node: MemberExpressionLike,
  replacements: Readonly<Record<string, string | undefined>>
): { name: string; replacement: string } | null {
  const name = getMemberPropertyName(node);
  if (name === null) {
    return null;
  }

  const replacement = replacements[name];
  return replacement === undefined ? null : { name, replacement };
}

/**
 * Resolve a member property name from dot or string-computed access.
 * @param node - The member expression-like node to inspect.
 * @returns The property name, or null.
 */
export function getMemberPropertyName(
  node: MemberExpressionLike
): string | null {
  if (!node.computed) {
    return isString(node.property.name) ? node.property.name : null;
  }

  return isString(node.property.value) ? node.property.value : null;
}

/**
 * Read the `max` property from an option object.
 * @param option - The option value to inspect.
 * @returns The raw `max` value, or undefined.
 */
export function getOptionMaxValue(option: unknown): unknown {
  return isPlainObject(option) ? Reflect.get(option, "max") : undefined;
}

/**
 * Collect direct child AST nodes using visitor keys.
 * @param node - The node to inspect.
 * @param sourceCode - An object exposing visitor keys.
 * @returns The traversable child nodes.
 */
export function getVisitorChildNodes(
  node: Readonly<TSESTree.Node>,
  sourceCode: SourceCodeVisitorKeysLike
): ReadonlyArray<TSESTree.Node> {
  const visitorKeys = sourceCode.visitorKeys[node.type] ?? [];
  return visitorKeys.flatMap((key) => {
    const value = Reflect.get(node, key);
    if (Array.isArray(value)) {
      return value.filter(isNodeLike);
    }
    return isNodeLike(value) ? [value] : [];
  });
}

/**
 * Resolve the most descriptive function name available.
 * @param node - The function-like node to inspect.
 * @returns The resolved function name.
 */
export function resolveFunctionName(node: Readonly<FunctionNode>): string {
  return (
    getFunctionDeclarationName(node) ??
    getFunctionVariableName(node) ??
    getFunctionMethodName(node) ??
    ANONYMOUS_FUNCTION_NAME
  );
}

function getRuntimeParent(node: Readonly<TSESTree.Node>): TSESTree.Node | null {
  const parent: unknown = Reflect.get(node, "parent");
  return isNodeLike(parent) ? parent : null;
}
