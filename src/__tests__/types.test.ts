import { TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  getFirstTypeArgument,
  getTypeReferenceName,
  hasAllReadonlyPropertyMembers,
  hasNamedTypeReferenceWithTypeArguments,
  hasTypeArguments,
  isNamedTypeReference,
  unwrapTsExpression,
} from "../ast/types";
import {
  asExpressionStatement,
  asTSAsExpression,
  asTSTypeAliasDeclaration,
  asTSTypeLiteral,
  asTSTypeReference,
  asVariableDeclaration,
} from "./test-helpers";

function parseExpr(code: string): TSESTree.Expression {
  return asExpressionStatement(parse(code, { jsx: false }).body[0]).expression;
}

function parseTSAsExpr(code: string): TSESTree.TSAsExpression {
  const decl = asVariableDeclaration(parse(code, { jsx: false }).body[0]);
  return asTSAsExpression(decl.declarations[0].init);
}

function parseTypeAlias(code: string): TSESTree.TSTypeAliasDeclaration {
  return asTSTypeAliasDeclaration(parse(code, { jsx: false }).body[0]);
}

function testGetFirstTypeArgument(): void {
  it("should return the first type argument", () => {
    const typeRef = asTSTypeReference(parseTSAsExpr("const x = null as Foo<Bar>;").typeAnnotation);
    expect(getFirstTypeArgument(typeRef)?.type).toBe("TSTypeReference");
  });
  it("should return null when no type arguments exist", () => {
    const typeRef = asTSTypeReference(parseTSAsExpr("const x = null as Foo;").typeAnnotation);
    expect(getFirstTypeArgument(typeRef)).toBeNull();
  });
}

function testGetTypeReferenceName(): void {
  it("should return name from simple TSTypeReference", () => {
    expect(getTypeReferenceName(asTSTypeReference(parseTSAsExpr("const x = null as Foo;").typeAnnotation))).toBe("Foo");
  });
  it("should return null for qualified name", () => {
    expect(getTypeReferenceName(asTSTypeReference(parseTSAsExpr("const x = null as A.B;").typeAnnotation))).toBeNull();
  });
}

function testHasAllReadonlyPropertyMembers(): void {
  it("should return true when all members are readonly", () => {
    const tl = asTSTypeLiteral(parseTypeAlias("type X = { readonly a: string; readonly b: number };").typeAnnotation);
    expect(hasAllReadonlyPropertyMembers(tl)).toBe(true);
  });
  it("should return false when not all members are readonly", () => {
    const tl = asTSTypeLiteral(parseTypeAlias("type X = { readonly a: string; b: number };").typeAnnotation);
    expect(hasAllReadonlyPropertyMembers(tl)).toBe(false);
  });
  it("should return true for empty type literal", () => {
    const tl = asTSTypeLiteral(parseTypeAlias("type X = {};").typeAnnotation);
    expect(hasAllReadonlyPropertyMembers(tl)).toBe(true);
  });
}

function testHasNamedTypeReferenceWithTypeArguments(): void {
  it("should return true for matching named references with type arguments", () => {
    const typeRef = asTSTypeReference(parseTSAsExpr("const x = null as Foo<Bar>;").typeAnnotation);
    expect(hasNamedTypeReferenceWithTypeArguments(typeRef, "Foo")).toBe(true);
  });
  it("should return false when the name differs or arguments are absent", () => {
    const typeRef = asTSTypeReference(parseTSAsExpr("const x = null as Foo;").typeAnnotation);
    expect(hasNamedTypeReferenceWithTypeArguments(typeRef, "Bar")).toBe(false);
    expect(hasNamedTypeReferenceWithTypeArguments(typeRef, "Foo")).toBe(false);
  });
}

function testHasTypeArguments(): void {
  it("should return true for TSTypeReference with type arguments", () => {
    expect(hasTypeArguments(asTSTypeReference(parseTSAsExpr("const x = null as Foo<Bar>;").typeAnnotation))).toBe(true);
  });
  it("should return false for TSTypeReference without type arguments", () => {
    expect(hasTypeArguments(asTSTypeReference(parseTSAsExpr("const x = null as Foo;").typeAnnotation))).toBe(false);
  });
}

function testIsNamedTypeReference(): void {
  it("should return true for matching type reference name", () => {
    expect(isNamedTypeReference(parseTSAsExpr("const x = null as Foo;").typeAnnotation, "Foo")).toBe(true);
  });
  it("should return false for non-matching name", () => {
    expect(isNamedTypeReference(parseTSAsExpr("const x = null as Foo;").typeAnnotation, "Bar")).toBe(false);
  });
  it("should return false for null", () => {
    expect(isNamedTypeReference(null, "Foo")).toBe(false);
  });
}

function testUnwrapTsExpression(): void {
  it("should unwrap TSAsExpression", () => {
    const node = asTSAsExpression(parseExpr("x as string"));
    expect(unwrapTsExpression(node).type).toBe("Identifier");
  });
  it("should unwrap nested TSAsExpression", () => {
    const node = asTSAsExpression(parseExpr("x as unknown as string"));
    expect(unwrapTsExpression(node).type).toBe("Identifier");
  });
  it("should unwrap TSNonNullExpression wrappers", () => {
    expect(unwrapTsExpression(parseExpr("x!")).type).toBe("Identifier");
  });
  it("should return the node if not a TS wrapper expression", () => {
    const node = parseExpr("x");
    expect(unwrapTsExpression(node)).toBe(node);
  });
}

describe("types", () => {
  describe("getFirstTypeArgument", testGetFirstTypeArgument);
  describe("getTypeReferenceName", testGetTypeReferenceName);
  describe("hasAllReadonlyPropertyMembers", testHasAllReadonlyPropertyMembers);
  describe("hasNamedTypeReferenceWithTypeArguments", testHasNamedTypeReferenceWithTypeArguments);
  describe("hasTypeArguments", testHasTypeArguments);
  describe("isNamedTypeReference", testIsNamedTypeReference);
  describe("unwrapTsExpression", testUnwrapTsExpression);
});
