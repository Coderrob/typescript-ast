import { TSESTree } from "@typescript-eslint/types";
import { isBlockStatement, isLiteral, isReturnStatement } from "../guards/nodes";
import { getNextStatementInBlock, getNodeParent } from "./navigation";

/**
 * Get boolean literal value (true/false) from return statement or null.
 * @param statement - The statement to inspect.
 * @returns The boolean value if the statement is a return with a boolean literal, otherwise null.
 */
export function getBooleanLiteralReturnValue(
  statement: Readonly<TSESTree.Statement> | null
): boolean | null {
  const returnStatement = getReturnStatement(statement);
  return returnStatement?.argument ? getBooleanLiteralValue(returnStatement.argument) : null;
}

/**
 * Get a boolean literal value from an expression.
 * @param value - The expression to inspect.
 * @returns The boolean literal value, or null.
 */
export function getBooleanLiteralValue(
  value: Readonly<TSESTree.Expression> | null | undefined
): boolean | null {
  return isLiteral(value) && typeof value.value === "boolean" ? value.value : null;
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
  return parent && isBlockStatement(parent) ? getNextStatementInBlock(parent, statement) : null;
}

/**
 * Get a ReturnStatement from a statement or reducible single-return block.
 * @param statement - The statement to inspect.
 * @returns The ReturnStatement, or null.
 */
export function getReturnStatement(
  statement: Readonly<TSESTree.Statement> | null
): TSESTree.ReturnStatement | null {
  if (statement === null) {
    return null;
  }
  if (isReturnStatement(statement)) {
    return statement;
  }
  return isBlockStatement(statement) ? getSingleReturnStatement(statement) : null;
}

/**
 * Get the return statement if the block has exactly one statement that is a ReturnStatement.
 * @param block - The block statement to inspect.
 * @returns The single ReturnStatement if present, otherwise null.
 */
export function getSingleReturnStatement(
  block: Readonly<TSESTree.BlockStatement>
): TSESTree.ReturnStatement | null {
  const statement = block.body[0];
  return block.body.length === 1 && isReturnStatement(statement) ? statement : null;
}
