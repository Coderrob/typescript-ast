"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAncestor = findAncestor;
exports.findEnclosingFunction = findEnclosingFunction;
exports.isInsideBoundary = isInsideBoundary;
exports.getParentBlockStatement = getParentBlockStatement;
exports.getNextStatementInBlock = getNextStatementInBlock;
const nodes_1 = require("../guards/nodes");
/**
 * Walk up the parent chain to find the first ancestor matching the predicate.
 */
function findAncestor(node, predicate) {
    let current = node?.parent;
    while (current) {
        if (predicate(current))
            return current;
        current = current.parent;
    }
    return null;
}
/**
 * Find nearest enclosing function-like node.
 */
function findEnclosingFunction(node) {
    const ancestor = findAncestor(node, nodes_1.isFunctionLike);
    if (!ancestor)
        return null;
    return ancestor;
}
/**
 * Check if a node is inside a boundary defined by stopTypes where matchTypes are found.
 */
function isInsideBoundary(node, stopTypes, matchTypes) {
    let current = node?.parent;
    while (current) {
        if (matchTypes.includes(current.type))
            return true;
        if (stopTypes.includes(current.type))
            return false;
        current = current.parent;
    }
    return false;
}
/**
 * Get the parent BlockStatement of a node.
 */
function getParentBlockStatement(node) {
    const ancestor = findAncestor(node, nodes_1.isBlockStatement);
    if (!ancestor)
        return null;
    return ancestor;
}
/**
 * Get the next sibling statement after node in a block.
 */
function getNextStatementInBlock(block, node) {
    const idx = block.body.indexOf(node);
    if (idx === -1 || idx === block.body.length - 1)
        return null;
    return block.body[idx + 1];
}
//# sourceMappingURL=navigation.js.map