import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { simpleTraverse } from "@typescript-eslint/typescript-estree";

type TypedNode = Readonly<{ type: string }>;

export function asArrowFunctionExpression(
  node: Readonly<TSESTree.Node> | null | undefined,
): TSESTree.ArrowFunctionExpression {
  if (node?.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    return node;
  }

  return throwUnexpectedNodeType(node, "ArrowFunctionExpression");
}

export function asAssignmentPattern(node: Readonly<TSESTree.Node> | null | undefined): TSESTree.AssignmentPattern {
  if (node?.type === AST_NODE_TYPES.AssignmentPattern) {
    return node;
  }

  return throwUnexpectedNodeType(node, "AssignmentPattern");
}

export function asBinaryExpression(node: Readonly<TSESTree.Node> | null): TSESTree.BinaryExpression {
  if (node?.type === AST_NODE_TYPES.BinaryExpression) {
    return node;
  }

  return throwUnexpectedNodeType(node, "BinaryExpression");
}

export function asBlockStatement(node: Readonly<TSESTree.Node> | null): TSESTree.BlockStatement {
  if (node?.type === AST_NODE_TYPES.BlockStatement) {
    return node;
  }

  return throwUnexpectedNodeType(node, "BlockStatement");
}

export function asCallExpression(node: Readonly<TSESTree.Node> | null): TSESTree.CallExpression {
  if (node?.type === AST_NODE_TYPES.CallExpression) {
    return node;
  }

  return throwUnexpectedNodeType(node, "CallExpression");
}

export function asClassDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.ClassDeclaration {
  if (node?.type === AST_NODE_TYPES.ClassDeclaration) {
    return node;
  }

  return throwUnexpectedNodeType(node, "ClassDeclaration");
}

export function asExpressionStatement(node: Readonly<TSESTree.Node> | null): TSESTree.ExpressionStatement {
  if (node?.type === AST_NODE_TYPES.ExpressionStatement) {
    return node;
  }

  return throwUnexpectedNodeType(node, "ExpressionStatement");
}

export function asForStatement(node: Readonly<TSESTree.Node> | null): TSESTree.ForStatement {
  if (node?.type === AST_NODE_TYPES.ForStatement) {
    return node;
  }

  return throwUnexpectedNodeType(node, "ForStatement");
}

export function asFunctionDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.FunctionDeclaration {
  if (node?.type === AST_NODE_TYPES.FunctionDeclaration) {
    return node;
  }

  return throwUnexpectedNodeType(node, "FunctionDeclaration");
}

export function asFunctionExpression(node: Readonly<TSESTree.Node> | null): TSESTree.FunctionExpression {
  if (node?.type === AST_NODE_TYPES.FunctionExpression) {
    return node;
  }

  return throwUnexpectedNodeType(node, "FunctionExpression");
}

export function asIdentifier(node: Readonly<TSESTree.Node> | null): TSESTree.Identifier {
  if (node?.type === AST_NODE_TYPES.Identifier) {
    return node;
  }

  return throwUnexpectedNodeType(node, "Identifier");
}

export function asMemberExpression(node: Readonly<TSESTree.Node> | null): TSESTree.MemberExpression {
  if (node?.type === AST_NODE_TYPES.MemberExpression) {
    return node;
  }

  return throwUnexpectedNodeType(node, "MemberExpression");
}

export function asMethodDefinition(node: Readonly<TSESTree.Node> | null): TSESTree.MethodDefinition {
  if (node?.type === AST_NODE_TYPES.MethodDefinition) {
    return node;
  }

  return throwUnexpectedNodeType(node, "MethodDefinition");
}

export function asRestElement(node: Readonly<TSESTree.Node> | null | undefined): TSESTree.RestElement {
  if (node?.type === AST_NODE_TYPES.RestElement) {
    return node;
  }

  return throwUnexpectedNodeType(node, "RestElement");
}

export function asReturnStatement(node: Readonly<TSESTree.Node> | null): TSESTree.ReturnStatement {
  if (node?.type === AST_NODE_TYPES.ReturnStatement) {
    return node;
  }

  return throwUnexpectedNodeType(node, "ReturnStatement");
}

export function asSwitchStatement(node: Readonly<TSESTree.Node> | null): TSESTree.SwitchStatement {
  if (node?.type === AST_NODE_TYPES.SwitchStatement) {
    return node;
  }

  return throwUnexpectedNodeType(node, "SwitchStatement");
}

export function asTSAsExpression(node: Readonly<TSESTree.Node> | null): TSESTree.TSAsExpression {
  if (node?.type === AST_NODE_TYPES.TSAsExpression) {
    return node;
  }

  return throwUnexpectedNodeType(node, "TSAsExpression");
}

export function asTSEnumDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.TSEnumDeclaration {
  if (node?.type === AST_NODE_TYPES.TSEnumDeclaration) {
    return node;
  }

  return throwUnexpectedNodeType(node, "TSEnumDeclaration");
}

export function asTSTypeAliasDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.TSTypeAliasDeclaration {
  if (node?.type === AST_NODE_TYPES.TSTypeAliasDeclaration) {
    return node;
  }

  return throwUnexpectedNodeType(node, "TSTypeAliasDeclaration");
}

export function asTSTypeLiteral(node: Readonly<TSESTree.TypeNode>): TSESTree.TSTypeLiteral {
  if (node.type === AST_NODE_TYPES.TSTypeLiteral) {
    return node;
  }

  return throwUnexpectedNodeType(node, "TSTypeLiteral");
}

export function asTSTypeReference(node: Readonly<TSESTree.TypeNode>): TSESTree.TSTypeReference {
  if (node.type === AST_NODE_TYPES.TSTypeReference) {
    return node;
  }

  return throwUnexpectedNodeType(node, "TSTypeReference");
}

export function asVariableDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.VariableDeclaration {
  if (node?.type === AST_NODE_TYPES.VariableDeclaration) {
    return node;
  }

  return throwUnexpectedNodeType(node, "VariableDeclaration");
}

export function asVariableDeclarator(node: Readonly<TSESTree.Node> | null): TSESTree.VariableDeclarator {
  if (node?.type === AST_NODE_TYPES.VariableDeclarator) {
    return node;
  }

  return throwUnexpectedNodeType(node, "VariableDeclarator");
}

export function attachParents(ast: Readonly<TSESTree.Program>): void {
  simpleTraverse(
    ast,
    {
      enter(node, parent) {
        if (parent) {
          Reflect.set(node, "parent", parent);
        }
      },
    },
    true,
  );
}

function throwUnexpectedNodeType(node: TypedNode | null | undefined, expectedType: string): never {
  const actualType = node ? node.type : "null";
  throw new Error(`Expected ${expectedType}, got ${actualType}`);
}
