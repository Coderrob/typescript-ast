"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleReturnStatement = getSingleReturnStatement;
exports.getReturnStatement = getReturnStatement;
exports.getBooleanLiteralReturnValue = getBooleanLiteralReturnValue;
exports.getFollowingStatementInBlock = getFollowingStatementInBlock;
const nodes_1 = require("../guards/nodes");
const navigation_1 = require("./navigation");
/**
 * Get the return statement if the block has exactly one statement that is a ReturnStatement.
 */
function getSingleReturnStatement(block) {
    if (block.body.length === 1 && (0, nodes_1.isReturnStatement)(block.body[0])) {
        return block.body[0];
    }
    return null;
}
/**
 * Get a ReturnStatement from a statement (or null if not a ReturnStatement).
 */
function getReturnStatement(statement) {
    return (0, nodes_1.isReturnStatement)(statement) ? statement : null;
}
/**
 * Get boolean literal value (true/false) from return statement or null.
 */
function getBooleanLiteralReturnValue(statement) {
    const ret = getReturnStatement(statement);
    if (!ret || !ret.argument)
        return null;
    if ((0, nodes_1.isLiteral)(ret.argument) && typeof ret.argument.value === "boolean") {
        return ret.argument.value;
    }
    return null;
}
/**
 * Get the statement following the given statement in its parent block.
 */
function getFollowingStatementInBlock(statement) {
    const parent = statement.parent;
    if (!parent || !(0, nodes_1.isBlockStatement)(parent))
        return null;
    return (0, navigation_1.getNextStatementInBlock)(parent, statement);
}
//# sourceMappingURL=statements.js.map