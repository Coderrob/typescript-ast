import { parse } from "@typescript-eslint/typescript-estree";
import { TSESTree } from "@typescript-eslint/types";
import {
  getTypeReferenceName,
  hasTypeArguments,
  hasAllReadonlyPropertyMembers,
  unwrapTsExpression,
  isNamedTypeReference,
} from "../ast/types";

describe("types", () => {
  describe("getTypeReferenceName", () => {
    it("returns name from simple TSTypeReference", () => {
      const ast = parse("const x = null as Foo;", { jsx: false });
      const stmt = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (stmt.declarations[0] as TSESTree.VariableDeclarator).init as TSESTree.TSAsExpression;
      const typeRef = init.typeAnnotation as TSESTree.TSTypeReference;
      expect(getTypeReferenceName(typeRef)).toBe("Foo");
    });

    it("returns null for qualified name", () => {
      const ast = parse("const x = null as A.B;", { jsx: false });
      const stmt = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (stmt.declarations[0] as TSESTree.VariableDeclarator).init as TSESTree.TSAsExpression;
      const typeRef = init.typeAnnotation as TSESTree.TSTypeReference;
      expect(getTypeReferenceName(typeRef)).toBeNull();
    });
  });

  describe("hasTypeArguments", () => {
    it("returns true for TSTypeReference with type arguments", () => {
      const ast = parse("const x = null as Foo<Bar>;", { jsx: false });
      const stmt = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (stmt.declarations[0] as TSESTree.VariableDeclarator).init as TSESTree.TSAsExpression;
      const typeRef = init.typeAnnotation as TSESTree.TSTypeReference;
      expect(hasTypeArguments(typeRef)).toBe(true);
    });

    it("returns false for TSTypeReference without type arguments", () => {
      const ast = parse("const x = null as Foo;", { jsx: false });
      const stmt = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (stmt.declarations[0] as TSESTree.VariableDeclarator).init as TSESTree.TSAsExpression;
      const typeRef = init.typeAnnotation as TSESTree.TSTypeReference;
      expect(hasTypeArguments(typeRef)).toBe(false);
    });
  });

  describe("hasAllReadonlyPropertyMembers", () => {
    it("returns true when all members are readonly", () => {
      const ast = parse("type X = { readonly a: string; readonly b: number };", { jsx: false });
      const alias = ast.body[0] as TSESTree.TSTypeAliasDeclaration;
      const typeLiteral = alias.typeAnnotation as TSESTree.TSTypeLiteral;
      expect(hasAllReadonlyPropertyMembers(typeLiteral)).toBe(true);
    });

    it("returns false when not all members are readonly", () => {
      const ast = parse("type X = { readonly a: string; b: number };", { jsx: false });
      const alias = ast.body[0] as TSESTree.TSTypeAliasDeclaration;
      const typeLiteral = alias.typeAnnotation as TSESTree.TSTypeLiteral;
      expect(hasAllReadonlyPropertyMembers(typeLiteral)).toBe(false);
    });

    it("returns true for empty type literal", () => {
      const ast = parse("type X = {};", { jsx: false });
      const alias = ast.body[0] as TSESTree.TSTypeAliasDeclaration;
      const typeLiteral = alias.typeAnnotation as TSESTree.TSTypeLiteral;
      expect(hasAllReadonlyPropertyMembers(typeLiteral)).toBe(true);
    });
  });

  describe("unwrapTsExpression", () => {
    it("unwraps TSAsExpression", () => {
      const ast = parse("x as string", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression as TSESTree.TSAsExpression;
      const unwrapped = unwrapTsExpression(node);
      expect(unwrapped.type).toBe("Identifier");
    });

    it("unwraps nested TSAsExpression", () => {
      const ast = parse("x as unknown as string", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression as TSESTree.TSAsExpression;
      const unwrapped = unwrapTsExpression(node);
      expect(unwrapped.type).toBe("Identifier");
    });

    it("returns the node if not a TSAsExpression or TSSatisfiesExpression", () => {
      const ast = parse("x", { jsx: false });
      const node = (ast.body[0] as TSESTree.ExpressionStatement).expression;
      expect(unwrapTsExpression(node)).toBe(node);
    });
  });

  describe("isNamedTypeReference", () => {
    it("returns true for matching type reference name", () => {
      const ast = parse("const x = null as Foo;", { jsx: false });
      const stmt = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (stmt.declarations[0] as TSESTree.VariableDeclarator).init as TSESTree.TSAsExpression;
      expect(isNamedTypeReference(init.typeAnnotation, "Foo")).toBe(true);
    });

    it("returns false for non-matching name", () => {
      const ast = parse("const x = null as Foo;", { jsx: false });
      const stmt = ast.body[0] as TSESTree.VariableDeclaration;
      const init = (stmt.declarations[0] as TSESTree.VariableDeclarator).init as TSESTree.TSAsExpression;
      expect(isNamedTypeReference(init.typeAnnotation, "Bar")).toBe(false);
    });

    it("returns false for null", () => {
      expect(isNamedTypeReference(null, "Foo")).toBe(false);
    });
  });
});
