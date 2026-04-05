import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { isIdentifier, isTSParameterProperty, isTSTypeAnnotation } from "../guards/nodes";

const THIS_PARAMETER_NAME = "this";

/**
 * Get the identifier bound by an assignment-pattern parameter.
 * @param param - The assignment pattern parameter.
 * @returns The bound identifier, or null.
 */
export function getAssignmentPatternIdentifier(
  param: Readonly<TSESTree.AssignmentPattern>
): TSESTree.Identifier | null {
  return isIdentifier(param.left) ? param.left : null;
}

/**
 * Get the first parameter that is not a 'this' keyword parameter.
 * @param params - The array of function parameters.
 * @returns The first non-this parameter, or null if all are 'this' parameters.
 */
export function getFirstNonThisParameter(
  params: readonly TSESTree.Parameter[]
): TSESTree.Parameter | null {
  for (const param of params) {
    if (!isThisParameter(param)) {
      return param;
    }
  }
  return null;
}

/**
 * Get the identifier bound by a directly nameable parameter.
 * @param param - The parameter to inspect.
 * @returns The bound identifier, or null.
 */
export function getNamedParameterIdentifier(
  param: Readonly<TSESTree.Parameter>
): TSESTree.Identifier | null {
  if (isIdentifier(param)) {
    return param;
  }
  if (param.type === AST_NODE_TYPES.AssignmentPattern) {
    return getAssignmentPatternIdentifier(param);
  }
  if (param.type === AST_NODE_TYPES.RestElement) {
    return getRestElementIdentifier(param);
  }
  return null;
}

/**
 * Get the name bound by a directly nameable parameter.
 * @param param - The parameter to inspect.
 * @returns The parameter name, or null.
 */
export function getNamedParameterName(param: Readonly<TSESTree.Parameter>): string | null {
  return getNamedParameterIdentifier(param)?.name ?? null;
}

/**
 * Get the type node from a destructured (ObjectPattern) parameter.
 * @param param - The function parameter to inspect.
 * @returns The type node if the parameter destructures an object and is typed.
 */
export function getObjectDestructuredParameterTypeNode(
  param: Readonly<TSESTree.Parameter>
): TSESTree.TypeNode | null {
  if (param.type === AST_NODE_TYPES.ObjectPattern) {
    return getParameterTypeNode(param);
  }
  if (param.type === AST_NODE_TYPES.AssignmentPattern && param.left.type === AST_NODE_TYPES.ObjectPattern) {
    return param.left.typeAnnotation?.typeAnnotation ?? null;
  }
  return null;
}

/**
 * Get the TSTypeAnnotation from a function parameter.
 * @param param - The function parameter to inspect.
 * @returns The TSTypeAnnotation node if present, otherwise null.
 */
export function getParameterTypeAnnotation(
  param: Readonly<TSESTree.Parameter>
): TSESTree.TSTypeAnnotation | null {
  const targetParam = isTSParameterProperty(param) ? param.parameter : param;
  if (targetParam.type === AST_NODE_TYPES.AssignmentPattern) {
    const annotation = "typeAnnotation" in targetParam.left ? targetParam.left.typeAnnotation : undefined;
    return isTSTypeAnnotation(annotation) ? annotation : null;
  }
  if ("typeAnnotation" in targetParam && targetParam.typeAnnotation) {
    return isTSTypeAnnotation(targetParam.typeAnnotation) ? targetParam.typeAnnotation : null;
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
  return getParameterTypeAnnotation(param)?.typeAnnotation ?? null;
}

/**
 * Get the identifier bound by a rest parameter.
 * @param param - The rest parameter to inspect.
 * @returns The bound identifier, or null.
 */
export function getRestElementIdentifier(
  param: Readonly<TSESTree.RestElement>
): TSESTree.Identifier | null {
  return isIdentifier(param.argument) ? param.argument : null;
}

/**
 * Get the identifier from a TSParameterProperty.
 * @param param - The function parameter to inspect.
 * @returns The identifier if the parameter is a TSParameterProperty with an identifier, otherwise null.
 */
export function getTsParameterPropertyIdentifier(
  param: Readonly<TSESTree.Parameter>
): TSESTree.Identifier | null {
  if (!isTSParameterProperty(param)) {
    return null;
  }
  if (isIdentifier(param.parameter)) {
    return param.parameter;
  }
  return param.parameter.type === AST_NODE_TYPES.AssignmentPattern
    ? getAssignmentPatternIdentifier(param.parameter)
    : null;
}

/**
 * Check if a parameter is a 'this' keyword parameter.
 * @param param - The function parameter to check.
 * @returns True if the parameter is a 'this' identifier.
 */
export function isThisParameter(param: Readonly<TSESTree.Parameter>): boolean {
  return isIdentifier(param) && param.name === THIS_PARAMETER_NAME;
}
