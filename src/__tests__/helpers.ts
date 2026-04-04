import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { simpleTraverse } from "@typescript-eslint/typescript-estree";

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

export function asMethodDefinition(node: Readonly<TSESTree.Node> | null): TSESTree.MethodDefinition {
  if (node?.type === AST_NODE_TYPES.MethodDefinition) return node;
  throw new Error(`Expected MethodDefinition, got ${node?.type ?? "null"}`);
}

export function asReturnStatement(node: Readonly<TSESTree.Node> | null): TSESTree.ReturnStatement {
  if (node?.type === AST_NODE_TYPES.ReturnStatement) return node;
  throw new Error(`Expected ReturnStatement, got ${node?.type ?? "null"}`);
}

export function asTSAsExpression(node: Readonly<TSESTree.Node> | null): TSESTree.TSAsExpression {
  if (node?.type === AST_NODE_TYPES.TSAsExpression) return node;
  throw new Error(`Expected TSAsExpression, got ${node?.type ?? "null"}`);
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
