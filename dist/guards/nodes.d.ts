import { TSESTree } from "@typescript-eslint/types";
/** Type guard for Identifier nodes */
export declare function isIdentifier(node: TSESTree.Node | null | undefined): node is TSESTree.Identifier;
/** Type guard for MemberExpression nodes */
export declare function isMemberExpression(node: TSESTree.Node | null | undefined): node is TSESTree.MemberExpression;
/** Type guard for CallExpression nodes */
export declare function isCallExpression(node: TSESTree.Node | null | undefined): node is TSESTree.CallExpression;
/** Type guard for Literal nodes */
export declare function isLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.Literal;
/** Type guard for string Literal nodes */
export declare function isStringLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.StringLiteral;
/** Type guard for BlockStatement nodes */
export declare function isBlockStatement(node: TSESTree.Node | null | undefined): node is TSESTree.BlockStatement;
/** Type guard for ReturnStatement nodes */
export declare function isReturnStatement(node: TSESTree.Node | null | undefined): node is TSESTree.ReturnStatement;
/** Type guard for function-like nodes (FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction) */
export declare function isFunctionLike(node: TSESTree.Node | null | undefined): node is TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | TSESTree.TSDeclareFunction;
/** Type guard for TSParameterProperty nodes */
export declare function isTSParameterProperty(node: TSESTree.Node | null | undefined): node is TSESTree.TSParameterProperty;
/** Type guard for TSTypeAnnotation nodes */
export declare function isTSTypeAnnotation(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeAnnotation;
/** Type guard for TSTypeReference nodes */
export declare function isTSTypeReference(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeReference;
/** Type guard for TSTypeLiteral nodes */
export declare function isTSTypeLiteral(node: TSESTree.Node | null | undefined): node is TSESTree.TSTypeLiteral;
/** Type guard for TSPropertySignature nodes */
export declare function isTSPropertySignature(node: TSESTree.Node | null | undefined): node is TSESTree.TSPropertySignature;
/** Type guard for TSAsExpression nodes */
export declare function isTSAsExpression(node: TSESTree.Node | null | undefined): node is TSESTree.TSAsExpression;
/** Type guard for TSSatisfiesExpression nodes */
export declare function isTSSatisfiesExpression(node: TSESTree.Node | null | undefined): node is TSESTree.TSSatisfiesExpression;
/** Type guard for ThisExpression nodes */
export declare function isThisExpression(node: TSESTree.Node | null | undefined): node is TSESTree.ThisExpression;
//# sourceMappingURL=nodes.d.ts.map