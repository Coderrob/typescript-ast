import { TSESTree } from "@typescript-eslint/types";
/**
 * Get the return statement if the block has exactly one statement that is a ReturnStatement.
 */
export declare function getSingleReturnStatement(block: TSESTree.BlockStatement): TSESTree.ReturnStatement | null;
/**
 * Get a ReturnStatement from a statement (or null if not a ReturnStatement).
 */
export declare function getReturnStatement(statement: TSESTree.Statement): TSESTree.ReturnStatement | null;
/**
 * Get boolean literal value (true/false) from return statement or null.
 */
export declare function getBooleanLiteralReturnValue(statement: TSESTree.Statement): boolean | null;
/**
 * Get the statement following the given statement in its parent block.
 */
export declare function getFollowingStatementInBlock(statement: TSESTree.Statement): TSESTree.Statement | null;
//# sourceMappingURL=statements.d.ts.map