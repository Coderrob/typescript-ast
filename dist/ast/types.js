"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeReferenceName = getTypeReferenceName;
exports.hasTypeArguments = hasTypeArguments;
exports.hasAllReadonlyPropertyMembers = hasAllReadonlyPropertyMembers;
exports.unwrapTsExpression = unwrapTsExpression;
exports.isNamedTypeReference = isNamedTypeReference;
const nodes_1 = require("../guards/nodes");
/**
 * Get the name string from a TSTypeReference node.
 */
function getTypeReferenceName(node) {
    if ((0, nodes_1.isIdentifier)(node.typeName))
        return node.typeName.name;
    return null;
}
/**
 * Check if a TSTypeReference has type arguments.
 */
function hasTypeArguments(node) {
    return !!(node.typeArguments && node.typeArguments.params.length > 0);
}
/**
 * Check if a TSTypeLiteral has all readonly property members.
 */
function hasAllReadonlyPropertyMembers(node) {
    return node.members.every((member) => (0, nodes_1.isTSPropertySignature)(member) && member.readonly === true);
}
/**
 * Unwrap TSAsExpression or TSSatisfiesExpression to the inner expression.
 */
function unwrapTsExpression(expression) {
    let current = expression;
    while ((0, nodes_1.isTSAsExpression)(current) || (0, nodes_1.isTSSatisfiesExpression)(current)) {
        current = current.expression;
    }
    return current;
}
/**
 * Check if a node is a TSTypeReference with the given name.
 */
function isNamedTypeReference(node, name) {
    return (0, nodes_1.isTSTypeReference)(node) && getTypeReferenceName(node) === name;
}
//# sourceMappingURL=types.js.map