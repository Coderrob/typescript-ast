import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { isIdentifier, isTSParameterProperty, isTSTypeAnnotation } from "../guards/nodes";

const THIS_PARAMETER_NAME = "this";

/**
 * Get the identifier bound by an assignment-pattern parameter.
 * @param param - The assignment pattern parameter.
 * @returns The bound identifier, or null.
 */
export function getAssignmentPatternIdentifier(
  param: Readonly<TSESTree.AssignmentPattern>,
): TSESTree.Identifier | null {
  return isIdentifier(param.left) ? param.left : null;
}

/**
 * Get destructured object type node from an assignment-pattern parameter.
 * @param param - The parameter to inspect.
 * @returns The type node when present, otherwise null.
 */
function getAssignmentPatternObjectDestructuredTypeNode(param: Readonly<TSESTree.Parameter>): TSESTree.TypeNode | null {
  if (param.type !== AST_NODE_TYPES.AssignmentPattern) {
    return null;
  }

  return isObjectPatternParameter(param.left) ? getObjectPatternTypeNode(param.left) : null;
}

/**
 * Get a type annotation from an assignment-pattern parameter.
 * @param param - The assignment-pattern parameter.
 * @returns The type annotation when present, otherwise null.
 */
function getAssignmentPatternTypeAnnotation(
  param: Readonly<TSESTree.AssignmentPattern>,
): TSESTree.TSTypeAnnotation | null {
  const annotation = "typeAnnotation" in param.left ? param.left.typeAnnotation : undefined;
  return isTSTypeAnnotation(annotation) ? annotation : null;
}

/**
 * Get the first parameter that is not a 'this' keyword parameter.
 * @param params - The array of function parameters.
 * @returns The first non-this parameter, or null if all are 'this' parameters.
 */
export function getFirstNonThisParameter(params: readonly TSESTree.Parameter[]): TSESTree.Parameter | null {
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
export function getNamedParameterIdentifier(param: Readonly<TSESTree.Parameter>): TSESTree.Identifier | null {
  if (isIdentifier(param)) {
    return param;
  }

  return getNonIdentifierNamedParameter(param);
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
 * Get the identifier from non-Identifier named parameter forms.
 * @param param - The parameter to inspect.
 * @returns The bound identifier, or null.
 */
function getNonIdentifierNamedParameter(param: Readonly<TSESTree.Parameter>): TSESTree.Identifier | null {
  if (param.type === AST_NODE_TYPES.AssignmentPattern) {
    return getAssignmentPatternIdentifier(param);
  }

  return param.type === AST_NODE_TYPES.RestElement ? getRestElementIdentifier(param) : null;
}

/**
 * Get the type node from a destructured (ObjectPattern) parameter.
 * @param param - The function parameter to inspect.
 * @returns The type node if the parameter destructures an object and is typed.
 */
export function getObjectDestructuredParameterTypeNode(param: Readonly<TSESTree.Parameter>): TSESTree.TypeNode | null {
  return isObjectPatternParameter(param)
    ? getParameterTypeNode(param)
    : getAssignmentPatternObjectDestructuredTypeNode(param);
}

/**
 * Get the type node from an object-pattern parameter.
 * @param param - The object-pattern parameter.
 * @returns The type node when present, otherwise null.
 */
function getObjectPatternTypeNode(param: Readonly<TSESTree.ObjectPattern>): TSESTree.TypeNode | null {
  return param.typeAnnotation?.typeAnnotation ?? null;
}

/**
 * Get a parameter's own type annotation when directly available.
 * @param param - The parameter to inspect.
 * @returns The type annotation when present, otherwise null.
 */
function getParameterOwnTypeAnnotation(param: Readonly<TSESTree.Parameter>): TSESTree.TSTypeAnnotation | null {
  if (!hasParameterOwnTypeAnnotation(param)) {
    return null;
  }

  return param.typeAnnotation;
}

/**
 * Get the TSTypeAnnotation from a function parameter.
 * @param param - The function parameter to inspect.
 * @returns The TSTypeAnnotation node if present, otherwise null.
 */
export function getParameterTypeAnnotation(param: Readonly<TSESTree.Parameter>): TSESTree.TSTypeAnnotation | null {
  const targetParam = isTSParameterProperty(param) ? param.parameter : param;
  return targetParam.type === AST_NODE_TYPES.AssignmentPattern
    ? getAssignmentPatternTypeAnnotation(targetParam)
    : getParameterOwnTypeAnnotation(targetParam);
}

/**
 * Get the type node from a parameter's type annotation.
 * @param param - The function parameter to inspect.
 * @returns The type node if a type annotation exists, otherwise null.
 */
export function getParameterTypeNode(param: Readonly<TSESTree.Parameter>): TSESTree.TypeNode | null {
  return getParameterTypeAnnotation(param)?.typeAnnotation ?? null;
}

/**
 * Get the identifier bound by a rest parameter.
 * @param param - The rest parameter to inspect.
 * @returns The bound identifier, or null.
 */
export function getRestElementIdentifier(param: Readonly<TSESTree.RestElement>): TSESTree.Identifier | null {
  return isIdentifier(param.argument) ? param.argument : null;
}

/**
 * Get the identifier from a TSParameterProperty.
 * @param param - The function parameter to inspect.
 * @returns The identifier if the parameter is a TSParameterProperty with an identifier, otherwise null.
 */
export function getTsParameterPropertyIdentifier(param: Readonly<TSESTree.Parameter>): TSESTree.Identifier | null {
  if (!isTSParameterProperty(param)) {
    return null;
  }

  return getTsParameterPropertyParameterIdentifier(param.parameter);
}

/**
 * Get the identifier represented by a TSParameterProperty parameter payload.
 * @param parameter - The TSParameterProperty parameter payload.
 * @returns The bound identifier, or null.
 */
function getTsParameterPropertyParameterIdentifier(
  parameter: Readonly<TSESTree.Parameter>,
): TSESTree.Identifier | null {
  if (isIdentifier(parameter)) {
    return parameter;
  }

  return parameter.type === AST_NODE_TYPES.AssignmentPattern ? getAssignmentPatternIdentifier(parameter) : null;
}

/**
 * Check whether a parameter directly carries a TSTypeAnnotation.
 * @param param - The parameter to inspect.
 * @returns True when the parameter has a direct type annotation.
 */
function hasParameterOwnTypeAnnotation(
  param: Readonly<TSESTree.Parameter>,
): param is Readonly<TSESTree.Parameter & { typeAnnotation: TSESTree.TSTypeAnnotation }> {
  return "typeAnnotation" in param && isTSTypeAnnotation(param.typeAnnotation);
}

/**
 * Check whether a parameter is an object pattern.
 * @param param - The parameter to inspect.
 * @returns True when the parameter is an ObjectPattern.
 */
function isObjectPatternParameter(param: Readonly<TSESTree.Parameter>): param is TSESTree.ObjectPattern {
  return param.type === AST_NODE_TYPES.ObjectPattern;
}

/**
 * Check if a parameter is a 'this' keyword parameter.
 * @param param - The function parameter to check.
 * @returns True if the parameter is a 'this' identifier.
 */
export function isThisParameter(param: Readonly<TSESTree.Parameter>): boolean {
  return isIdentifier(param) && param.name === THIS_PARAMETER_NAME;
}
