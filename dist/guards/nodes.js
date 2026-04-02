"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIdentifier = isIdentifier;
exports.isMemberExpression = isMemberExpression;
exports.isCallExpression = isCallExpression;
exports.isLiteral = isLiteral;
exports.isStringLiteral = isStringLiteral;
exports.isBlockStatement = isBlockStatement;
exports.isReturnStatement = isReturnStatement;
exports.isFunctionLike = isFunctionLike;
exports.isTSParameterProperty = isTSParameterProperty;
exports.isTSTypeAnnotation = isTSTypeAnnotation;
exports.isTSTypeReference = isTSTypeReference;
exports.isTSTypeLiteral = isTSTypeLiteral;
exports.isTSPropertySignature = isTSPropertySignature;
exports.isTSAsExpression = isTSAsExpression;
exports.isTSSatisfiesExpression = isTSSatisfiesExpression;
exports.isThisExpression = isThisExpression;
const types_1 = require("@typescript-eslint/types");
/** Type guard for Identifier nodes */
function isIdentifier(node) {
    return node?.type === types_1.AST_NODE_TYPES.Identifier;
}
/** Type guard for MemberExpression nodes */
function isMemberExpression(node) {
    return node?.type === types_1.AST_NODE_TYPES.MemberExpression;
}
/** Type guard for CallExpression nodes */
function isCallExpression(node) {
    return node?.type === types_1.AST_NODE_TYPES.CallExpression;
}
/** Type guard for Literal nodes */
function isLiteral(node) {
    return node?.type === types_1.AST_NODE_TYPES.Literal;
}
/** Type guard for string Literal nodes */
function isStringLiteral(node) {
    return node?.type === types_1.AST_NODE_TYPES.Literal && typeof node.value === "string";
}
/** Type guard for BlockStatement nodes */
function isBlockStatement(node) {
    return node?.type === types_1.AST_NODE_TYPES.BlockStatement;
}
/** Type guard for ReturnStatement nodes */
function isReturnStatement(node) {
    return node?.type === types_1.AST_NODE_TYPES.ReturnStatement;
}
/** Type guard for function-like nodes (FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction) */
function isFunctionLike(node) {
    return (node?.type === types_1.AST_NODE_TYPES.FunctionDeclaration ||
        node?.type === types_1.AST_NODE_TYPES.FunctionExpression ||
        node?.type === types_1.AST_NODE_TYPES.ArrowFunctionExpression ||
        node?.type === types_1.AST_NODE_TYPES.TSDeclareFunction);
}
/** Type guard for TSParameterProperty nodes */
function isTSParameterProperty(node) {
    return node?.type === types_1.AST_NODE_TYPES.TSParameterProperty;
}
/** Type guard for TSTypeAnnotation nodes */
function isTSTypeAnnotation(node) {
    return node?.type === types_1.AST_NODE_TYPES.TSTypeAnnotation;
}
/** Type guard for TSTypeReference nodes */
function isTSTypeReference(node) {
    return node?.type === types_1.AST_NODE_TYPES.TSTypeReference;
}
/** Type guard for TSTypeLiteral nodes */
function isTSTypeLiteral(node) {
    return node?.type === types_1.AST_NODE_TYPES.TSTypeLiteral;
}
/** Type guard for TSPropertySignature nodes */
function isTSPropertySignature(node) {
    return node?.type === types_1.AST_NODE_TYPES.TSPropertySignature;
}
/** Type guard for TSAsExpression nodes */
function isTSAsExpression(node) {
    return node?.type === types_1.AST_NODE_TYPES.TSAsExpression;
}
/** Type guard for TSSatisfiesExpression nodes */
function isTSSatisfiesExpression(node) {
    return node?.type === types_1.AST_NODE_TYPES.TSSatisfiesExpression;
}
/** Type guard for ThisExpression nodes */
function isThisExpression(node) {
    return node?.type === types_1.AST_NODE_TYPES.ThisExpression;
}
//# sourceMappingURL=nodes.js.map