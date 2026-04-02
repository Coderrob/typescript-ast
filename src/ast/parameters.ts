import { TSESTree } from "@typescript-eslint/types";
import { isIdentifier, isTSParameterProperty, isTSTypeAnnotation } from "../guards/nodes";

/**
 * Get the TSTypeAnnotation from a function parameter.
 */
export function getParameterTypeAnnotation(
  param: TSESTree.Parameter
): TSESTree.TSTypeAnnotation | null {
  if ("typeAnnotation" in param && param.typeAnnotation) {
    if (isTSTypeAnnotation(param.typeAnnotation)) return param.typeAnnotation;
  }
  return null;
}

/**
 * Get the type node from a parameter's type annotation.
 */
export function getParameterTypeNode(
  param: TSESTree.Parameter
): TSESTree.TypeNode | null {
  const annotation = getParameterTypeAnnotation(param);
  return annotation?.typeAnnotation ?? null;
}

/**
 * Get the type node from a destructured (ObjectPattern) parameter.
 */
export function getObjectDestructuredParameterTypeNode(
  param: TSESTree.Parameter
): TSESTree.TypeNode | null {
  if (param.type !== "ObjectPattern") return null;
  return getParameterTypeNode(param);
}

/**
 * Get the first parameter that is not a 'this' keyword parameter.
 */
export function getFirstNonThisParameter(
  params: TSESTree.Parameter[]
): TSESTree.Parameter | null {
  return params.find((p) => !isThisParameter(p)) ?? null;
}

/**
 * Check if a parameter is a 'this' keyword parameter.
 */
export function isThisParameter(param: TSESTree.Parameter): boolean {
  return isIdentifier(param) && param.name === "this";
}

/**
 * Get the identifier from a TSParameterProperty.
 */
export function getTsParameterPropertyIdentifier(
  param: TSESTree.Parameter
): TSESTree.Identifier | null {
  if (!isTSParameterProperty(param)) return null;
  if (isIdentifier(param.parameter)) return param.parameter;
  return null;
}
