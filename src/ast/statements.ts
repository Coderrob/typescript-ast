import { TSESTree } from "@typescript-eslint/types";
import { isReturnStatement, isLiteral, isBlockStatement } from "../guards/nodes";
import { getNextStatementInBlock } from "./navigation";

/**
 * Get the return statement if the block has exactly one statement that is a ReturnStatement.
 */
export function getSingleReturnStatement(
  block: TSESTree.BlockStatement
): TSESTree.ReturnStatement | null {
  if (block.body.length === 1 && isReturnStatement(block.body[0])) {
    return block.body[0] as TSESTree.ReturnStatement;
  }
  return null;
}

/**
 * Get a ReturnStatement from a statement (or null if not a ReturnStatement).
 */
export function getReturnStatement(
  statement: TSESTree.Statement
): TSESTree.ReturnStatement | null {
  return isReturnStatement(statement) ? statement : null;
}

/**
 * Get boolean literal value (true/false) from return statement or null.
 */
export function getBooleanLiteralReturnValue(
  statement: TSESTree.Statement
): boolean | null {
  const ret = getReturnStatement(statement);
  if (!ret || !ret.argument) return null;
  if (isLiteral(ret.argument) && typeof ret.argument.value === "boolean") {
    return ret.argument.value;
  }
  return null;
}

/**
 * Get the statement following the given statement in its parent block.
 */
export function getFollowingStatementInBlock(
  statement: TSESTree.Statement
): TSESTree.Statement | null {
  const parent = (statement as TSESTree.Statement & { parent?: TSESTree.Node }).parent;
  if (!parent || !isBlockStatement(parent)) return null;
  return getNextStatementInBlock(parent as TSESTree.BlockStatement, statement);
}
