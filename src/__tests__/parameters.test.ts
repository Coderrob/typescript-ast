import { TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  getAssignmentPatternIdentifier,
  getFirstNonThisParameter,
  getNamedParameterIdentifier,
  getNamedParameterName,
  getObjectDestructuredParameterTypeNode,
  getParameterTypeAnnotation,
  getParameterTypeNode,
  getRestElementIdentifier,
  getTsParameterPropertyIdentifier,
  isThisParameter,
} from "../ast/parameters";
import {
  asAssignmentPattern,
  asClassDeclaration,
  asFunctionDeclaration,
  asFunctionExpression,
  asIdentifier,
  asMethodDefinition,
  asRestElement,
} from "./test-helpers";

const ASSIGNMENT_PATTERN_NODE_TYPE = "AssignmentPattern";
const IDENTIFIER_NODE_TYPE = "Identifier";

function parseClassCtor(code: string): TSESTree.FunctionExpression {
  const cls = asClassDeclaration(parse(code, { jsx: false }).body[0]);
  return asFunctionExpression(asMethodDefinition(cls.body.body[0]).value);
}

function parseFn(code: string): TSESTree.FunctionDeclaration {
  return asFunctionDeclaration(parse(code, { jsx: false }).body[0]);
}

function testAdditionalTypeAnnotationBranches(): void {
  it("should return null for defaulted object destructuring without a type annotation", () => {
    expect(getObjectDestructuredParameterTypeNode(parseFn("function f({ x } = defaults) {}").params[0])).toBeNull();
  });

  it("should return null when assignment-pattern left typeAnnotation is not TSTypeAnnotation", () => {
    const param = parseFn("function f(x = value) {}").params[0];
    if (param.type !== ASSIGNMENT_PATTERN_NODE_TYPE || param.left.type !== IDENTIFIER_NODE_TYPE) {
      throw new Error("Expected assignment pattern with identifier left side");
    }

    Reflect.set(param.left, "typeAnnotation", { type: "Identifier" });
    expect(getParameterTypeAnnotation(param)).toBeNull();
  });
}

function testGetFirstNonThisParameter(): void {
  it("should return first non-this parameter", () => {
    const param = getFirstNonThisParameter(parseFn("function f(this: Foo, x: string) {}").params);
    expect(param).not.toBeNull();
    expect(asIdentifier(param).name).toBe("x");
  });
  it("should return first parameter when no this param", () => {
    const param = getFirstNonThisParameter(parseFn("function f(x: string) {}").params);
    expect(asIdentifier(param).name).toBe("x");
  });
  it("should return null for empty params", () => {
    expect(getFirstNonThisParameter(parseFn("function f() {}").params)).toBeNull();
  });
}

function testGetObjectDestructuredParameterTypeNode(): void {
  it("should return type node from object destructured parameter", () => {
    expect(getObjectDestructuredParameterTypeNode(parseFn("function f({ x }: MyType) {}").params[0])).not.toBeNull();
  });
  it("should return type node from defaulted object destructuring parameter", () => {
    expect(
      getObjectDestructuredParameterTypeNode(parseFn("function f({ x }: MyType = fallback) {}").params[0]),
    ).not.toBeNull();
  });
  it("should return null for non-object pattern parameter", () => {
    expect(getObjectDestructuredParameterTypeNode(parseFn("function f(x: string) {}").params[0])).toBeNull();
  });
}

function testGetParameterTypeAnnotation(): void {
  it("should return type annotation from typed parameter", () => {
    const annotation = getParameterTypeAnnotation(parseFn("function f(x: string) {}").params[0]);
    expect(annotation).not.toBeNull();
    expect(annotation?.type).toBe("TSTypeAnnotation");
  });
  it("should return type annotation from TSParameterProperty", () => {
    const fn = parseClassCtor("class C { constructor(private x: string) {} }");
    const annotation = getParameterTypeAnnotation(fn.params[0]);
    expect(annotation).not.toBeNull();
    expect(annotation?.type).toBe("TSTypeAnnotation");
  });
  it("should return type annotation from assignment-pattern parameters", () => {
    const annotation = getParameterTypeAnnotation(parseFn("function f(x: string = 'a') {}").params[0]);
    expect(annotation?.type).toBe("TSTypeAnnotation");
  });
  it("should return null for parameter without type annotation", () => {
    expect(getParameterTypeAnnotation(parseFn("function f(x) {}").params[0])).toBeNull();
  });
  it("should return null for assignment-pattern parameter whose left side has no typeAnnotation slot", () => {
    expect(getParameterTypeAnnotation(parseFn("function f([x] = values) {}").params[0])).toBeNull();
  });
}

function testGetParameterTypeNode(): void {
  it("should return type node from typed parameter", () => {
    const typeNode = getParameterTypeNode(parseFn("function f(x: string) {}").params[0]);
    expect(typeNode).not.toBeNull();
    expect(typeNode?.type).toBe("TSStringKeyword");
  });
  it("should return null when no annotation", () => {
    expect(getParameterTypeNode(parseFn("function f(x) {}").params[0])).toBeNull();
  });
}

function testGetTsParameterPropertyIdentifier(): void {
  it("should return identifier from TSParameterProperty", () => {
    const fn = parseClassCtor("class C { constructor(private x: string) {} }");
    const ident = getTsParameterPropertyIdentifier(fn.params[0]);
    expect(ident).not.toBeNull();
    expect(ident?.name).toBe("x");
  });
  it("should return null for regular parameter", () => {
    expect(getTsParameterPropertyIdentifier(parseFn("function f(x: string) {}").params[0])).toBeNull();
  });
  it("should resolve identifier from assignment-pattern TSParameterProperty", () => {
    const fn = parseClassCtor("class C { constructor(private x = 'a') {} }");
    const ident = getTsParameterPropertyIdentifier(fn.params[0]);
    expect(ident).not.toBeNull();
    expect(ident?.name).toBe("x");
  });
  it("should return null for TSParameterProperty with non-identifier non-assignment parameter", () => {
    const fn = parseClassCtor("class C { constructor(private x: string) {} }");
    const objectPatternParam = parseFn("function f({ x }) {}").params[0];
    Reflect.set(fn.params[0], "parameter", objectPatternParam);
    expect(getTsParameterPropertyIdentifier(fn.params[0])).toBeNull();
  });
}

function testIsThisParameter(): void {
  it("should return true for 'this' parameter", () => {
    expect(isThisParameter(parseFn("function f(this: Foo) {}").params[0])).toBe(true);
  });
  it("should return false for regular identifier parameter", () => {
    expect(isThisParameter(parseFn("function f(x: string) {}").params[0])).toBe(false);
  });
}

function testNamedParameterHelpers(): void {
  it("should resolve direct identifier parameters", () => {
    const param = parseFn("function f(x: string) {}").params[0];
    expect(getNamedParameterIdentifier(param)?.name).toBe("x");
    expect(getNamedParameterName(param)).toBe("x");
  });

  it("should resolve assignment-pattern identifiers", () => {
    const assignment = asAssignmentPattern(parseFn("function f(x = 1) {}").params[0]);
    expect(getAssignmentPatternIdentifier(assignment)?.name).toBe("x");
    expect(getNamedParameterIdentifier(assignment)?.name).toBe("x");
    expect(getNamedParameterName(assignment)).toBe("x");
  });
  it("should return null for assignment-pattern identifiers when the left side is non-identifier", () => {
    const assignment = asAssignmentPattern(parseFn("function f([x] = values) {}").params[0]);
    expect(getAssignmentPatternIdentifier(assignment)).toBeNull();
  });
  it("should resolve rest-element identifiers", () => {
    const rest = asRestElement(parseFn("function f(...items) {}").params[0]);
    expect(getRestElementIdentifier(rest)?.name).toBe("items");
    expect(getNamedParameterIdentifier(rest)?.name).toBe("items");
  });
  it("should return null for rest-element identifiers when argument is a pattern", () => {
    const rest = asRestElement(parseFn("function f(...[item]) {}").params[0]);
    expect(getRestElementIdentifier(rest)).toBeNull();
  });
  it("should return null for destructured parameters", () => {
    expect(getNamedParameterIdentifier(parseFn("function f({ x }) {}").params[0])).toBeNull();
    expect(getNamedParameterName(parseFn("function f([x]) {}").params[0])).toBeNull();
  });
}

describe("parameters", () => {
  describe("getFirstNonThisParameter", testGetFirstNonThisParameter);
  describe("getObjectDestructuredParameterTypeNode", testGetObjectDestructuredParameterTypeNode);
  describe("getParameterTypeAnnotation", testGetParameterTypeAnnotation);
  describe("getParameterTypeNode", testGetParameterTypeNode);
  describe("getTsParameterPropertyIdentifier", testGetTsParameterPropertyIdentifier);
  describe("named parameter helpers", testNamedParameterHelpers);
  describe("additional type-annotation branches", testAdditionalTypeAnnotationBranches);
  describe("isThisParameter", testIsThisParameter);
});
