import { parse } from "@typescript-eslint/typescript-estree";
import { TSESTree } from "@typescript-eslint/types";
import {
  isIdentifier,
  isMemberExpression,
  isCallExpression,
  isLiteral,
  isStringLiteral,
  isBlockStatement,
  isReturnStatement,
  isFunctionLike,
  isTSParameterProperty,
  isTSTypeAnnotation,
  isTSTypeReference,
  isTSTypeLiteral,
  isTSPropertySignature,
  isTSAsExpression,
  isTSSatisfiesExpression,
  isThisExpression,
} from "../guards/nodes";

describe("guards", () => {
  describe("isIdentifier", () => {
    it("returns true for Identifier nodes", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isIdentifier(node)).toBe(true);
    });
    it("returns false for non-Identifier", () => {
      const ast = parse("1", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isIdentifier(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isIdentifier(null)).toBe(false);
    });
    it("returns false for undefined", () => {
      expect(isIdentifier(undefined)).toBe(false);
    });
  });

  describe("isMemberExpression", () => {
    it("returns true for MemberExpression nodes", () => {
      const ast = parse("foo.bar", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isMemberExpression(node)).toBe(true);
    });
    it("returns false for Identifier", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isMemberExpression(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isMemberExpression(null)).toBe(false);
    });
  });

  describe("isCallExpression", () => {
    it("returns true for CallExpression nodes", () => {
      const ast = parse("foo()", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isCallExpression(node)).toBe(true);
    });
    it("returns false for Identifier", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isCallExpression(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isCallExpression(null)).toBe(false);
    });
  });

  describe("isLiteral", () => {
    it("returns true for numeric Literal", () => {
      const ast = parse("1", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isLiteral(node)).toBe(true);
    });
    it("returns true for string Literal", () => {
      const ast = parse('"hello"', { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isLiteral(node)).toBe(true);
    });
    it("returns false for Identifier", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isLiteral(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isLiteral(null)).toBe(false);
    });
  });

  describe("isStringLiteral", () => {
    it("returns true for string Literal", () => {
      const ast = parse('"hello"', { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isStringLiteral(node)).toBe(true);
    });
    it("returns false for numeric Literal", () => {
      const ast = parse("42", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isStringLiteral(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isStringLiteral(null)).toBe(false);
    });
  });

  describe("isBlockStatement", () => {
    it("returns true for BlockStatement nodes", () => {
      const ast = parse("function f() {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(isBlockStatement(fn.body)).toBe(true);
    });
    it("returns false for Identifier", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isBlockStatement(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isBlockStatement(null)).toBe(false);
    });
  });

  describe("isReturnStatement", () => {
    it("returns true for ReturnStatement nodes", () => {
      const ast = parse("function f() { return 1; }", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const stmt = (fn.body as TSESTree.BlockStatement).body[0];
      expect(isReturnStatement(stmt)).toBe(true);
    });
    it("returns false for ExpressionStatement", () => {
      const ast = parse("x;", { jsx: false });
      const node = ast.body[0];
      expect(isReturnStatement(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isReturnStatement(null)).toBe(false);
    });
  });

  describe("isFunctionLike", () => {
    it("returns true for FunctionDeclaration", () => {
      const ast = parse("function f() {}", { jsx: false });
      expect(isFunctionLike(ast.body[0])).toBe(true);
    });
    it("returns true for FunctionExpression", () => {
      const ast = parse("const f = function() {};", { jsx: false });
      const decl = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (decl.declarations[0] as TSESTree.VariableDeclarator).init;
      expect(isFunctionLike(init)).toBe(true);
    });
    it("returns true for ArrowFunctionExpression", () => {
      const ast = parse("const f = () => {};", { jsx: false });
      const decl = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (decl.declarations[0] as TSESTree.VariableDeclarator).init;
      expect(isFunctionLike(init)).toBe(true);
    });
    it("returns false for Identifier", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isFunctionLike(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isFunctionLike(null)).toBe(false);
    });
  });

  describe("isTSParameterProperty", () => {
    it("returns true for TSParameterProperty", () => {
      const ast = parse("class C { constructor(private x: string) {} }", { jsx: false });
      const cls = ast.body[0] as TSESTree.ClassDeclaration;
      const ctor = cls.body.body[0] as TSESTree.MethodDefinition;
      const fn = ctor.value as TSESTree.FunctionExpression;
      expect(isTSParameterProperty(fn.params[0])).toBe(true);
    });
    it("returns false for regular parameter", () => {
      const ast = parse("function f(x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(isTSParameterProperty(fn.params[0])).toBe(false);
    });
    it("returns false for null", () => {
      expect(isTSParameterProperty(null)).toBe(false);
    });
  });

  describe("isTSTypeAnnotation", () => {
    it("returns true for TSTypeAnnotation", () => {
      const ast = parse("function f(x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const param = fn.params[0] as TSESTree.Identifier;
      expect(isTSTypeAnnotation(param.typeAnnotation)).toBe(true);
    });
    it("returns false for null", () => {
      expect(isTSTypeAnnotation(null)).toBe(false);
    });
  });

  describe("isTSTypeReference", () => {
    it("returns true for TSTypeReference", () => {
      const ast = parse("const x = null as Foo;", { jsx: false });
      const stmt = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (stmt.declarations[0] as TSESTree.VariableDeclarator).init as TSESTree.TSAsExpression;
      expect(isTSTypeReference(init.typeAnnotation)).toBe(true);
    });
    it("returns false for null", () => {
      expect(isTSTypeReference(null)).toBe(false);
    });
  });

  describe("isTSTypeLiteral", () => {
    it("returns true for TSTypeLiteral", () => {
      const ast = parse("type X = { a: string };", { jsx: false });
      const alias = ast.body[0] as TSESTree.TSTypeAliasDeclaration;
      expect(isTSTypeLiteral(alias.typeAnnotation)).toBe(true);
    });
    it("returns false for null", () => {
      expect(isTSTypeLiteral(null)).toBe(false);
    });
  });

  describe("isTSPropertySignature", () => {
    it("returns true for TSPropertySignature", () => {
      const ast = parse("type X = { a: string };", { jsx: false });
      const alias = ast.body[0] as TSESTree.TSTypeAliasDeclaration;
      const typeLiteral = alias.typeAnnotation as TSESTree.TSTypeLiteral;
      expect(isTSPropertySignature(typeLiteral.members[0])).toBe(true);
    });
    it("returns false for null", () => {
      expect(isTSPropertySignature(null)).toBe(false);
    });
  });

  describe("isTSAsExpression", () => {
    it("returns true for TSAsExpression", () => {
      const ast = parse("x as string", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isTSAsExpression(node)).toBe(true);
    });
    it("returns false for Identifier", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isTSAsExpression(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isTSAsExpression(null)).toBe(false);
    });
  });

  describe("isTSSatisfiesExpression", () => {
    it("returns true for TSSatisfiesExpression", () => {
      const ast = parse("x satisfies string", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isTSSatisfiesExpression(node)).toBe(true);
    });
    it("returns false for Identifier", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isTSSatisfiesExpression(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isTSSatisfiesExpression(null)).toBe(false);
    });
  });

  describe("isThisExpression", () => {
    it("returns true for ThisExpression", () => {
      const ast = parse("this", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isThisExpression(node)).toBe(true);
    });
    it("returns false for Identifier", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(isThisExpression(node)).toBe(false);
    });
    it("returns false for null", () => {
      expect(isThisExpression(null)).toBe(false);
    });
  });
});
