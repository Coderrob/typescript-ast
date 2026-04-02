import { TSESTree } from "@typescript-eslint/types";
/**
 * Get the TSTypeAnnotation from a function parameter.
 */
export declare function getParameterTypeAnnotation(param: TSESTree.Parameter): TSESTree.TSTypeAnnotation | null;
/**
 * Get the type node from a parameter's type annotation.
 */
export declare function getParameterTypeNode(param: TSESTree.Parameter): TSESTree.TypeNode | null;
/**
 * Get the type node from a destructured (ObjectPattern) parameter.
 */
export declare function getObjectDestructuredParameterTypeNode(param: TSESTree.Parameter): TSESTree.TypeNode | null;
/**
 * Get the first parameter that is not a 'this' keyword parameter.
 */
export declare function getFirstNonThisParameter(params: TSESTree.Parameter[]): TSESTree.Parameter | null;
/**
 * Check if a parameter is a 'this' keyword parameter.
 */
export declare function isThisParameter(param: TSESTree.Parameter): boolean;
/**
 * Get the identifier from a TSParameterProperty.
 */
export declare function getTsParameterPropertyIdentifier(param: TSESTree.Parameter): TSESTree.Identifier | null;
//# sourceMappingURL=parameters.d.ts.map