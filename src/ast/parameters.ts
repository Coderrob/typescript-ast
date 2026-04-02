import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { isIdentifier, isTSParameterProperty, isTSTypeAnnotation } from "../guards/nodes";

const THIS_PARAMETER_NAME = "this";

/**
 * Get the first parameter that is not a 'this' keyword parameter.
 * @param params - The array of function parameters.
 * @returns The first non-this parameter, or null if all are 'this' parameters.
 */
export function getFirstNonThisParameter(
  params: readonly TSESTree.Parameter[]
): TSESTree.Parameter | null {
  for (const p of params) {
    if (!isThisParameter(p)) return p;
  }
  return null;
}

/**
 * Get the type node from a destructured (ObjectPattern) parameter.
 * @param param - The function parameter to inspect.
 * @returns The type node if the parameter is an ObjectPattern with a type annotation, otherwise null.
 */
export function getObjectDestructuredParameterTypeNode(
  param: Readonly<TSESTree.Parameter>
): TSESTree.TypeNode | null {
  if (param.type !== AST_NODE_TYPES.ObjectPattern) return null;
  return getParameterTypeNode(param);
}

/**
 * Get the TSTypeAnnotation from a function parameter.
 * @param param - The function parameter to inspect.
 * @returns The TSTypeAnnotation node if present, otherwise null.
 */
export function getParameterTypeAnnotation(
  param: Readonly<TSESTree.Parameter>
): TSESTree.TSTypeAnnotation | null {
  if ("typeAnnotation" in param && param.typeAnnotation) {
    if (isTSTypeAnnotation(param.typeAnnotation)) return param.typeAnnotation;
  }
  return null;
}

/**
 * Get the type node from a parameter's type annotation.
 * @param param - The function parameter to inspect.
 * @returns The type node if a type annotation exists, otherwise null.
 */
export function getParameterTypeNode(
  param: Readonly<TSESTree.Parameter>
): TSESTree.TypeNode | null {
  const annotation = getParameterTypeAnnotation(param);
  return annotation?.typeAnnotation ?? null;
}

/**
 * Get the identifier from a TSParameterProperty.
 * @param param - The function parameter to inspect.
 * @returns The identifier if the parameter is a TSParameterProperty with an identifier, otherwise null.
 */
export function getTsParameterPropertyIdentifier(
  param: Readonly<TSESTree.Parameter>
): TSESTree.Identifier | null {
  if (!isTSParameterProperty(param)) return null;
  if (isIdentifier(param.parameter)) return param.parameter;
  return null;
}

/**
 * Check if a parameter is a 'this' keyword parameter.
 * @param param - The function parameter to check.
 * @returns True if the parameter is a 'this' identifier.
 */
export function isThisParameter(param: Readonly<TSESTree.Parameter>): boolean {
  return isIdentifier(param) && param.name === THIS_PARAMETER_NAME;
}
