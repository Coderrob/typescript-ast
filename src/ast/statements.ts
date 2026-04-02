import { TSESTree } from "@typescript-eslint/types";
import { isReturnStatement, isLiteral, isBlockStatement } from "../guards/nodes";
import { getNextStatementInBlock, getNodeParent } from "./navigation";

/**
 * Get boolean literal value (true/false) from return statement or null.
 * @param statement - The statement to inspect.
 * @returns The boolean value if the statement is a return with a boolean literal, otherwise null.
 */
export function getBooleanLiteralReturnValue(
  statement: Readonly<TSESTree.Statement>
): boolean | null {
  const ret = getReturnStatement(statement);
  if (!ret?.argument) return null;
  if (isLiteral(ret.argument) && typeof ret.argument.value === "boolean") {
    return ret.argument.value;
  }
  return null;
}

/**
 * Get the statement following the given statement in its parent block.
 * @param statement - The reference statement.
 * @returns The next statement in the parent block, or null if none.
 */
export function getFollowingStatementInBlock(
  statement: Readonly<TSESTree.Statement>
): TSESTree.Statement | null {
  const parent = getNodeParent(statement);
  if (!parent || !isBlockStatement(parent)) return null;
  return getNextStatementInBlock(parent, statement);
}

/**
 * Get a ReturnStatement from a statement (or null if not a ReturnStatement).
 * @param statement - The statement to inspect.
 * @returns The statement as a ReturnStatement, or null.
 */
export function getReturnStatement(
  statement: Readonly<TSESTree.Statement>
): TSESTree.ReturnStatement | null {
  return isReturnStatement(statement) ? statement : null;
}

/**
 * Get the return statement if the block has exactly one statement that is a ReturnStatement.
 * @param block - The block statement to inspect.
 * @returns The single ReturnStatement if present, otherwise null.
 */
export function getSingleReturnStatement(
  block: Readonly<TSESTree.BlockStatement>
): TSESTree.ReturnStatement | null {
  const stmt = block.body[0];
  if (block.body.length === 1 && isReturnStatement(stmt)) return stmt;
  return null;
}
