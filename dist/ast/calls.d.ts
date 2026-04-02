import { TSESTree } from "@typescript-eslint/types";
/**
 * Get the dotted name path from a callee expression (e.g., "foo.bar.baz").
 */
export declare function getCalleeNamePath(callee: TSESTree.LeftHandSideExpression): string | null;
/**
 * Check if a call expression has a simple identifier callee with the given name.
 */
export declare function hasIdentifierCallee(node: TSESTree.CallExpression, name: string): boolean;
/**
 * Check if a call expression has a MemberExpression callee.
 */
export declare function hasMemberCallee(node: TSESTree.CallExpression): boolean;
/**
 * Check if a call expression is to a named function.
 */
export declare function isNamedCall(node: TSESTree.CallExpression, name: string): boolean;
/**
 * Check if a call expression is to a named method on an object (e.g., object.method).
 */
export declare function isNamedMemberCall(node: TSESTree.CallExpression, objectName: string, propertyName: string): boolean;
/**
 * Get the first argument of a call expression.
 */
export declare function getFirstCallArgument(node: TSESTree.CallExpression): TSESTree.Node | null;
/**
 * Get the string literal argument at the given index.
 */
export declare function getStringLiteralCallArgument(node: TSESTree.CallExpression, index: number): string | null;
//# sourceMappingURL=calls.d.ts.map