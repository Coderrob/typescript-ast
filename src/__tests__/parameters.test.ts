import { parse } from "@typescript-eslint/typescript-estree";
import { TSESTree } from "@typescript-eslint/types";
import {
  getParameterTypeAnnotation,
  getParameterTypeNode,
  getObjectDestructuredParameterTypeNode,
  getFirstNonThisParameter,
  isThisParameter,
  getTsParameterPropertyIdentifier,
} from "../ast/parameters";

describe("parameters", () => {
  describe("getParameterTypeAnnotation", () => {
    it("returns type annotation from typed parameter", () => {
      const ast = parse("function f(x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const annotation = getParameterTypeAnnotation(fn.params[0]);
      expect(annotation).not.toBeNull();
      expect(annotation?.type).toBe("TSTypeAnnotation");
    });

    it("returns null for parameter without type annotation", () => {
      const ast = parse("function f(x) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(getParameterTypeAnnotation(fn.params[0])).toBeNull();
    });
  });

  describe("getParameterTypeNode", () => {
    it("returns type node from typed parameter", () => {
      const ast = parse("function f(x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const typeNode = getParameterTypeNode(fn.params[0]);
      expect(typeNode).not.toBeNull();
      expect(typeNode?.type).toBe("TSStringKeyword");
    });

    it("returns null when no annotation", () => {
      const ast = parse("function f(x) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(getParameterTypeNode(fn.params[0])).toBeNull();
    });
  });

  describe("getObjectDestructuredParameterTypeNode", () => {
    it("returns type node from object destructured parameter", () => {
      const ast = parse("function f({ x }: MyType) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const typeNode = getObjectDestructuredParameterTypeNode(fn.params[0]);
      expect(typeNode).not.toBeNull();
    });

    it("returns null for non-object pattern parameter", () => {
      const ast = parse("function f(x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(getObjectDestructuredParameterTypeNode(fn.params[0])).toBeNull();
    });
  });

  describe("isThisParameter", () => {
    it("returns true for 'this' parameter", () => {
      const ast = parse("function f(this: Foo) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(isThisParameter(fn.params[0])).toBe(true);
    });

    it("returns false for regular identifier parameter", () => {
      const ast = parse("function f(x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(isThisParameter(fn.params[0])).toBe(false);
    });
  });

  describe("getFirstNonThisParameter", () => {
    it("returns first non-this parameter", () => {
      const ast = parse("function f(this: Foo, x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const param = getFirstNonThisParameter(fn.params);
      expect(param).not.toBeNull();
      expect((param as TSESTree.Identifier).name).toBe("x");
    });

    it("returns first parameter when no this param", () => {
      const ast = parse("function f(x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      const param = getFirstNonThisParameter(fn.params);
      expect((param as TSESTree.Identifier).name).toBe("x");
    });

    it("returns null for empty params", () => {
      const ast = parse("function f() {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(getFirstNonThisParameter(fn.params)).toBeNull();
    });
  });

  describe("getTsParameterPropertyIdentifier", () => {
    it("returns identifier from TSParameterProperty", () => {
      const ast = parse("class C { constructor(private x: string) {} }", { jsx: false });
      const cls = ast.body[0] as TSESTree.ClassDeclaration;
      const ctor = cls.body.body[0] as TSESTree.MethodDefinition;
      const fn = ctor.value as TSESTree.FunctionExpression;
      const ident = getTsParameterPropertyIdentifier(fn.params[0]);
      expect(ident).not.toBeNull();
      expect(ident?.name).toBe("x");
    });

    it("returns null for regular parameter", () => {
      const ast = parse("function f(x: string) {}", { jsx: false });
      const fn = ast.body[0] as TSESTree.FunctionDeclaration;
      expect(getTsParameterPropertyIdentifier(fn.params[0])).toBeNull();
    });
  });
});
