import { TSESTree } from "@typescript-eslint/types";
/**
 * Get the name string from a TSTypeReference node.
 */
export declare function getTypeReferenceName(node: TSESTree.TSTypeReference): string | null;
/**
 * Check if a TSTypeReference has type arguments.
 */
export declare function hasTypeArguments(node: TSESTree.TSTypeReference): boolean;
/**
 * Check if a TSTypeLiteral has all readonly property members.
 */
export declare function hasAllReadonlyPropertyMembers(node: TSESTree.TSTypeLiteral): boolean;
/**
 * Unwrap TSAsExpression or TSSatisfiesExpression to the inner expression.
 */
export declare function unwrapTsExpression(expression: TSESTree.Expression): TSESTree.Expression;
/**
 * Check if a node is a TSTypeReference with the given name.
 */
export declare function isNamedTypeReference(node: TSESTree.Node | null | undefined, name: string): node is TSESTree.TSTypeReference;
//# sourceMappingURL=types.d.ts.map