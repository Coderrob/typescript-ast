import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { simpleTraverse } from "@typescript-eslint/typescript-estree";

export function asArrowFunctionExpression(node: Readonly<TSESTree.Node> | null | undefined): TSESTree.ArrowFunctionExpression {
  if (node?.type === AST_NODE_TYPES.ArrowFunctionExpression) return node;
  throw new Error(`Expected ArrowFunctionExpression, got ${node?.type ?? "null"}`);
}

export function asAssignmentPattern(node: Readonly<TSESTree.Node> | null | undefined): TSESTree.AssignmentPattern {
  if (node?.type === AST_NODE_TYPES.AssignmentPattern) return node;
  throw new Error(`Expected AssignmentPattern, got ${node?.type ?? "null"}`);
}

export function asBinaryExpression(node: Readonly<TSESTree.Node> | null): TSESTree.BinaryExpression {
  if (node?.type === AST_NODE_TYPES.BinaryExpression) return node;
  throw new Error(`Expected BinaryExpression, got ${node?.type ?? "null"}`);
}

export function asBlockStatement(node: Readonly<TSESTree.Node> | null): TSESTree.BlockStatement {
  if (node?.type === AST_NODE_TYPES.BlockStatement) return node;
  throw new Error(`Expected BlockStatement, got ${node?.type ?? "null"}`);
}

export function asCallExpression(node: Readonly<TSESTree.Node> | null): TSESTree.CallExpression {
  if (node?.type === AST_NODE_TYPES.CallExpression) return node;
  throw new Error(`Expected CallExpression, got ${node?.type ?? "null"}`);
}

export function asClassDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.ClassDeclaration {
  if (node?.type === AST_NODE_TYPES.ClassDeclaration) return node;
  throw new Error(`Expected ClassDeclaration, got ${node?.type ?? "null"}`);
}

export function asExpressionStatement(node: Readonly<TSESTree.Node> | null): TSESTree.ExpressionStatement {
  if (node?.type === AST_NODE_TYPES.ExpressionStatement) return node;
  throw new Error(`Expected ExpressionStatement, got ${node?.type ?? "null"}`);
}

export function asForStatement(node: Readonly<TSESTree.Node> | null): TSESTree.ForStatement {
  if (node?.type === AST_NODE_TYPES.ForStatement) return node;
  throw new Error(`Expected ForStatement, got ${node?.type ?? "null"}`);
}

export function asFunctionDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.FunctionDeclaration {
  if (node?.type === AST_NODE_TYPES.FunctionDeclaration) return node;
  throw new Error(`Expected FunctionDeclaration, got ${node?.type ?? "null"}`);
}

export function asFunctionExpression(node: Readonly<TSESTree.Node> | null): TSESTree.FunctionExpression {
  if (node?.type === AST_NODE_TYPES.FunctionExpression) return node;
  throw new Error(`Expected FunctionExpression, got ${node?.type ?? "null"}`);
}

export function asIdentifier(node: Readonly<TSESTree.Node> | null): TSESTree.Identifier {
  if (node?.type === AST_NODE_TYPES.Identifier) return node;
  throw new Error(`Expected Identifier, got ${node?.type ?? "null"}`);
}

export function asMemberExpression(node: Readonly<TSESTree.Node> | null): TSESTree.MemberExpression {
  if (node?.type === AST_NODE_TYPES.MemberExpression) return node;
  throw new Error(`Expected MemberExpression, got ${node?.type ?? "null"}`);
}

export function asMethodDefinition(node: Readonly<TSESTree.Node> | null): TSESTree.MethodDefinition {
  if (node?.type === AST_NODE_TYPES.MethodDefinition) return node;
  throw new Error(`Expected MethodDefinition, got ${node?.type ?? "null"}`);
}

export function asRestElement(node: Readonly<TSESTree.Node> | null | undefined): TSESTree.RestElement {
  if (node?.type === AST_NODE_TYPES.RestElement) return node;
  throw new Error(`Expected RestElement, got ${node?.type ?? "null"}`);
}

export function asReturnStatement(node: Readonly<TSESTree.Node> | null): TSESTree.ReturnStatement {
  if (node?.type === AST_NODE_TYPES.ReturnStatement) return node;
  throw new Error(`Expected ReturnStatement, got ${node?.type ?? "null"}`);
}

export function asSwitchStatement(node: Readonly<TSESTree.Node> | null): TSESTree.SwitchStatement {
  if (node?.type === AST_NODE_TYPES.SwitchStatement) return node;
  throw new Error(`Expected SwitchStatement, got ${node?.type ?? "null"}`);
}

export function asTSAsExpression(node: Readonly<TSESTree.Node> | null): TSESTree.TSAsExpression {
  if (node?.type === AST_NODE_TYPES.TSAsExpression) return node;
  throw new Error(`Expected TSAsExpression, got ${node?.type ?? "null"}`);
}

export function asTSEnumDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.TSEnumDeclaration {
  if (node?.type === AST_NODE_TYPES.TSEnumDeclaration) return node;
  throw new Error(`Expected TSEnumDeclaration, got ${node?.type ?? "null"}`);
}

export function asTSTypeAliasDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.TSTypeAliasDeclaration {
  if (node?.type === AST_NODE_TYPES.TSTypeAliasDeclaration) return node;
  throw new Error(`Expected TSTypeAliasDeclaration, got ${node?.type ?? "null"}`);
}

export function asTSTypeLiteral(node: Readonly<TSESTree.TypeNode>): TSESTree.TSTypeLiteral {
  if (node.type === AST_NODE_TYPES.TSTypeLiteral) return node;
  throw new Error(`Expected TSTypeLiteral, got ${node.type}`);
}

export function asTSTypeReference(node: Readonly<TSESTree.TypeNode>): TSESTree.TSTypeReference {
  if (node.type === AST_NODE_TYPES.TSTypeReference) return node;
  throw new Error(`Expected TSTypeReference, got ${node.type}`);
}

export function asVariableDeclaration(node: Readonly<TSESTree.Node> | null): TSESTree.VariableDeclaration {
  if (node?.type === AST_NODE_TYPES.VariableDeclaration) return node;
  throw new Error(`Expected VariableDeclaration, got ${node?.type ?? "null"}`);
}

export function asVariableDeclarator(node: Readonly<TSESTree.Node> | null): TSESTree.VariableDeclarator {
  if (node?.type === AST_NODE_TYPES.VariableDeclarator) return node;
  throw new Error(`Expected VariableDeclarator, got ${node?.type ?? "null"}`);
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
    true
  );
}
