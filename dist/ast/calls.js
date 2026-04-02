"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalleeNamePath = getCalleeNamePath;
exports.hasIdentifierCallee = hasIdentifierCallee;
exports.hasMemberCallee = hasMemberCallee;
exports.isNamedCall = isNamedCall;
exports.isNamedMemberCall = isNamedMemberCall;
exports.getFirstCallArgument = getFirstCallArgument;
exports.getStringLiteralCallArgument = getStringLiteralCallArgument;
const nodes_1 = require("../guards/nodes");
/**
 * Get the dotted name path from a callee expression (e.g., "foo.bar.baz").
 */
function getCalleeNamePath(callee) {
    if ((0, nodes_1.isIdentifier)(callee))
        return callee.name;
    if ((0, nodes_1.isMemberExpression)(callee) && !callee.computed) {
        const obj = getCalleeNamePath(callee.object);
        const prop = (0, nodes_1.isIdentifier)(callee.property) ? callee.property.name : null;
        if (obj && prop)
            return `${obj}.${prop}`;
    }
    return null;
}
/**
 * Check if a call expression has a simple identifier callee with the given name.
 */
function hasIdentifierCallee(node, name) {
    return (0, nodes_1.isIdentifier)(node.callee) && node.callee.name === name;
}
/**
 * Check if a call expression has a MemberExpression callee.
 */
function hasMemberCallee(node) {
    return (0, nodes_1.isMemberExpression)(node.callee);
}
/**
 * Check if a call expression is to a named function.
 */
function isNamedCall(node, name) {
    return getCalleeNamePath(node.callee) === name;
}
/**
 * Check if a call expression is to a named method on an object (e.g., object.method).
 */
function isNamedMemberCall(node, objectName, propertyName) {
    if (!(0, nodes_1.isMemberExpression)(node.callee))
        return false;
    const obj = node.callee.object;
    const prop = node.callee.property;
    return (0, nodes_1.isIdentifier)(obj) && obj.name === objectName &&
        (0, nodes_1.isIdentifier)(prop) && prop.name === propertyName;
}
/**
 * Get the first argument of a call expression.
 */
function getFirstCallArgument(node) {
    return node.arguments[0] ?? null;
}
/**
 * Get the string literal argument at the given index.
 */
function getStringLiteralCallArgument(node, index) {
    const arg = node.arguments[index];
    if (!arg)
        return null;
    if ((0, nodes_1.isStringLiteral)(arg))
        return arg.value;
    return null;
}
//# sourceMappingURL=calls.js.map