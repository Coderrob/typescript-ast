import { TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  isBinaryExpression,
  isBinaryExpressionNode,
  isIdentifier,
  isNamedIdentifier,
  isNamedIdentifierNode,
  isNodeLike,
  isMemberExpression,
  isCallExpression,
  isLiteral,
  isStringLiteral,
  isBlockStatement,
  isReturnStatement,
  isFunctionLike,
  isSwitchCase,
  isSwitchCaseNode,
  isTestFile,
  isTSParameterProperty,
  isTSEnumMember,
  isTSEnumMemberNode,
  isTSNonNullExpression,
  isTSTypeAnnotation,
  isTSTypeReference,
  isTSTypeLiteral,
  isTSPropertySignature,
  isTSAsExpression,
  isTSSatisfiesExpression,
  isThisExpression,
  isUnaryExpression,
  isUnaryExpressionNode,
  isUncomputedMemberExpression,
  isUncomputedMemberExpressionNode,
  isVariableDeclaration,
  isVariableDeclarationNode,
  isVariableDeclarator,
  isVariableDeclaratorNode,
} from "../guards/nodes";
import {
  asBlockStatement,
  asClassDeclaration,
  asExpressionStatement,
  asFunctionDeclaration,
  asFunctionExpression,
  asIdentifier,
  asMethodDefinition,
  asTSAsExpression,
  asTSTypeAliasDeclaration,
  asTSTypeLiteral,
  asVariableDeclaration,
} from "./test-helpers";

const TSE_NUM_DECLARATION_NODE_TYPE = "TSEnumDeclaration";
const SWITCH_STATEMENT_NODE_TYPE = "SwitchStatement";

function parseClassCtor(code: string): TSESTree.FunctionExpression {
  const cls = asClassDeclaration(parse(code, { jsx: false }).body[0]);
  return asFunctionExpression(asMethodDefinition(cls.body.body[0]).value);
}

function parseExpr(code: string): TSESTree.Expression {
  return asExpressionStatement(parse(code, { jsx: false }).body[0]).expression;
}

function parseFn(code: string): TSESTree.FunctionDeclaration {
  return asFunctionDeclaration(parse(code, { jsx: false }).body[0]);
}

function parseTSAsExpr(code: string): TSESTree.TSAsExpression {
  const decl = asVariableDeclaration(parse(code, { jsx: false }).body[0]);
  return asTSAsExpression(decl.declarations[0].init);
}

function parseTypeAlias(code: string): TSESTree.TSTypeAliasDeclaration {
  return asTSTypeAliasDeclaration(parse(code, { jsx: false }).body[0]);
}

function parseVarDecl(code: string): TSESTree.VariableDeclaration {
  return asVariableDeclaration(parse(code, { jsx: false }).body[0]);
}

function parseVarInit(code: string): TSESTree.Expression | null {
  const decl = asVariableDeclaration(parse(code, { jsx: false }).body[0]);
  return decl.declarations[0].init;
}

function testAliasExports(): void {
  it("should expose node guard aliases", () => {
    expect(isBinaryExpressionNode).toBe(isBinaryExpression);
    expect(isNamedIdentifierNode).toBe(isNamedIdentifier);
    expect(isSwitchCaseNode).toBe(isSwitchCase);
    expect(isTSEnumMemberNode).toBe(isTSEnumMember);
    expect(isUnaryExpressionNode).toBe(isUnaryExpression);
    expect(isUncomputedMemberExpressionNode).toBe(isUncomputedMemberExpression);
    expect(isVariableDeclarationNode).toBe(isVariableDeclaration);
    expect(isVariableDeclaratorNode).toBe(isVariableDeclarator);
  });
}

function testIsBinaryExpression(): void {
  it("should return true for BinaryExpression", () => {
    expect(isBinaryExpression(parseExpr("1 + 2"))).toBe(true);
  });
  it("should return false for non-BinaryExpression", () => {
    expect(isBinaryExpression(parseExpr("x"))).toBe(false);
  });
}

function testIsBlockStatement(): void {
  it("should return true for BlockStatement nodes", () => {
    expect(isBlockStatement(parseFn("function f() {}").body)).toBe(true);
  });
  it("should return false for Identifier", () => {
    expect(isBlockStatement(parseExpr("x"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isBlockStatement(null)).toBe(false);
  });
}

function testIsCallExpression(): void {
  it("should return true for CallExpression nodes", () => {
    expect(isCallExpression(parseExpr("foo()"))).toBe(true);
  });
  it("should return false for Identifier", () => {
    expect(isCallExpression(parseExpr("x"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isCallExpression(null)).toBe(false);
  });
}

function testIsFunctionLike(): void {
  testIsFunctionLikeFalsy();
  testIsFunctionLikeTruthy();
}

function testIsFunctionLikeFalsy(): void {
  it("should return false for Identifier", () => {
    expect(isFunctionLike(parseExpr("x"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isFunctionLike(null)).toBe(false);
  });
}

function testIsFunctionLikeTruthy(): void {
  it("should return true for FunctionDeclaration", () => {
    expect(isFunctionLike(parse("function f() {}", { jsx: false }).body[0])).toBe(true);
  });
  it("should return true for FunctionExpression", () => {
    expect(isFunctionLike(parseVarInit("const f = function() {};"))).toBe(true);
  });
  it("should return true for ArrowFunctionExpression", () => {
    expect(isFunctionLike(parseVarInit("const f = () => {};"))).toBe(true);
  });
  it("should return true for TSDeclareFunction", () => {
    expect(isFunctionLike(parse("declare function f(x: string): void;", { jsx: false }).body[0])).toBe(true);
  });
}

function testIsIdentifier(): void {
  it("should return true for Identifier nodes", () => {
    expect(isIdentifier(parseExpr("x"))).toBe(true);
  });
  it("should return false for non-Identifier", () => {
    expect(isIdentifier(parseExpr("1"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isIdentifier(null)).toBe(false);
  });
  it("should return false for undefined", () => {
    expect(isIdentifier(undefined)).toBe(false);
  });
  it("should match named identifiers", () => {
    expect(isNamedIdentifier(parseExpr("x"), "x")).toBe(true);
    expect(isNamedIdentifier(parseExpr("x"), "y")).toBe(false);
  });
}

function testIsLiteral(): void {
  it("should return true for numeric Literal", () => {
    expect(isLiteral(parseExpr("1"))).toBe(true);
  });
  it("should return true for string Literal", () => {
    expect(isLiteral(parseExpr('"hello"'))).toBe(true);
  });
  it("should return false for Identifier", () => {
    expect(isLiteral(parseExpr("x"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isLiteral(null)).toBe(false);
  });
}

function testIsMemberExpression(): void {
  it("should return true for MemberExpression nodes", () => {
    expect(isMemberExpression(parseExpr("foo.bar"))).toBe(true);
  });
  it("should return false for Identifier", () => {
    expect(isMemberExpression(parseExpr("x"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isMemberExpression(null)).toBe(false);
  });
}

function testIsNodeLike(): void {
  it("should return true for AST nodes", () => {
    expect(isNodeLike(parseExpr("x"))).toBe(true);
  });
  it("should return false for values without string type", () => {
    expect(isNodeLike({})).toBe(false);
    expect(isNodeLike({ type: 1 })).toBe(false);
    expect(isNodeLike(null)).toBe(false);
  });
}

function testIsReturnStatement(): void {
  it("should return true for ReturnStatement nodes", () => {
    expect(isReturnStatement(asBlockStatement(parseFn("function f() { return 1; }").body).body[0])).toBe(true);
  });
  it("should return false for ExpressionStatement", () => {
    expect(isReturnStatement(parse("x;", { jsx: false }).body[0])).toBe(false);
  });
  it("should return false for null", () => {
    expect(isReturnStatement(null)).toBe(false);
  });
}

function testIsStringLiteral(): void {
  it("should return true for string Literal", () => {
    expect(isStringLiteral(parseExpr('"hello"'))).toBe(true);
  });
  it("should return false for numeric Literal", () => {
    expect(isStringLiteral(parseExpr("42"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isStringLiteral(null)).toBe(false);
  });
}

function testIsThisExpression(): void {
  it("should return true for ThisExpression", () => {
    expect(isThisExpression(parseExpr("this"))).toBe(true);
  });
  it("should return false for Identifier", () => {
    expect(isThisExpression(parseExpr("x"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isThisExpression(null)).toBe(false);
  });
}

function testIsTSAsExpression(): void {
  it("should return true for TSAsExpression", () => {
    expect(isTSAsExpression(parseExpr("x as string"))).toBe(true);
  });
  it("should return false for Identifier", () => {
    expect(isTSAsExpression(parseExpr("x"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isTSAsExpression(null)).toBe(false);
  });
}

function testIsTSEnumMember(): void {
  it("should return true for TSEnumMember", () => {
    const enumDecl = parse("enum Color { Red }", { jsx: false }).body[0];
    if (enumDecl.type !== TSE_NUM_DECLARATION_NODE_TYPE) {
      throw new Error(`Expected ${TSE_NUM_DECLARATION_NODE_TYPE}`);
    }
    expect(isTSEnumMember(enumDecl.body.members[0])).toBe(true);
  });
  it("should return false for non-TSEnumMember", () => {
    expect(isTSEnumMember(parseExpr("x"))).toBe(false);
  });
}

function testIsTSNonNullExpression(): void {
  it("should return true for TSNonNullExpression", () => {
    expect(isTSNonNullExpression(parseExpr("x!"))).toBe(true);
  });
  it("should return false for non-TSNonNullExpression", () => {
    expect(isTSNonNullExpression(parseExpr("x"))).toBe(false);
  });
}

function testIsTSParameterProperty(): void {
  it("should return true for TSParameterProperty", () => {
    const fn = parseClassCtor("class C { constructor(private x: string) {} }");
    expect(isTSParameterProperty(fn.params[0])).toBe(true);
  });
  it("should return false for regular parameter", () => {
    expect(isTSParameterProperty(parseFn("function f(x: string) {}").params[0])).toBe(false);
  });
  it("should return false for null", () => {
    expect(isTSParameterProperty(null)).toBe(false);
  });
}

function testIsTSPropertySignature(): void {
  it("should return true for TSPropertySignature", () => {
    const tl = asTSTypeLiteral(parseTypeAlias("type X = { a: string };").typeAnnotation);
    expect(isTSPropertySignature(tl.members[0])).toBe(true);
  });
  it("should return false for null", () => {
    expect(isTSPropertySignature(null)).toBe(false);
  });
}

function testIsTSSatisfiesExpression(): void {
  it("should return true for TSSatisfiesExpression", () => {
    expect(isTSSatisfiesExpression(parseExpr("x satisfies string"))).toBe(true);
  });
  it("should return false for Identifier", () => {
    expect(isTSSatisfiesExpression(parseExpr("x"))).toBe(false);
  });
  it("should return false for null", () => {
    expect(isTSSatisfiesExpression(null)).toBe(false);
  });
}

function testIsTSTypeAnnotation(): void {
  it("should return true for TSTypeAnnotation", () => {
    const param = asIdentifier(parseFn("function f(x: string) {}").params[0]);
    expect(isTSTypeAnnotation(param.typeAnnotation)).toBe(true);
  });
  it("should return false for null", () => {
    expect(isTSTypeAnnotation(null)).toBe(false);
  });
}

function testIsTSTypeLiteral(): void {
  it("should return true for TSTypeLiteral", () => {
    expect(isTSTypeLiteral(parseTypeAlias("type X = { a: string };").typeAnnotation)).toBe(true);
  });
  it("should return false for null", () => {
    expect(isTSTypeLiteral(null)).toBe(false);
  });
}

function testIsTSTypeReference(): void {
  it("should return true for TSTypeReference", () => {
    expect(isTSTypeReference(parseTSAsExpr("const x = null as Foo;").typeAnnotation)).toBe(true);
  });
  it("should return false for null", () => {
    expect(isTSTypeReference(null)).toBe(false);
  });
}

function testIsUnaryExpression(): void {
  it("should return true for UnaryExpression", () => {
    expect(isUnaryExpression(parseExpr("!x"))).toBe(true);
  });
  it("should return false for non-UnaryExpression", () => {
    expect(isUnaryExpression(parseExpr("x"))).toBe(false);
  });
}

function testIsUncomputedMemberExpression(): void {
  it("should return true for non-computed member expressions", () => {
    expect(isUncomputedMemberExpression(parseExpr("obj.prop"))).toBe(true);
  });
  it("should return false for computed member expressions", () => {
    expect(isUncomputedMemberExpression(parseExpr('obj["prop"]'))).toBe(false);
  });
}

function testSwitchAndTestFile(): void {
  it("should detect switch-case nodes", () => {
    const stmt = parse("switch (x) { case 1: break; }", { jsx: false }).body[0];
    if (stmt.type !== SWITCH_STATEMENT_NODE_TYPE) {
      throw new Error(`Expected ${SWITCH_STATEMENT_NODE_TYPE}`);
    }
    expect(isSwitchCase(stmt.cases[0])).toBe(true);
  });
  it("should identify test files", () => {
    expect(isTestFile("src/__tests__/foo.ts")).toBe(true);
    expect(isTestFile("src/foo.spec.ts")).toBe(true);
    expect(isTestFile(String.raw`SRC\__TESTS__\foo.ts`)).toBe(true);
    expect(isTestFile("src/foo.ts")).toBe(false);
  });
}

function testVariableGuards(): void {
  it("should detect variable declarations and declarators", () => {
    const decl = parseVarDecl("const x = 1;");
    expect(isVariableDeclaration(decl)).toBe(true);
    expect(isVariableDeclarator(decl.declarations[0])).toBe(true);
  });
  it("should return false for non-variable nodes", () => {
    expect(isVariableDeclaration(parseExpr("x"))).toBe(false);
    expect(isVariableDeclarator(parseExpr("x"))).toBe(false);
  });
}

describe("guards", () => {
  describe("isBinaryExpression", testIsBinaryExpression);
  describe("isIdentifier", testIsIdentifier);
  describe("isMemberExpression", testIsMemberExpression);
  describe("isNodeLike", testIsNodeLike);
  describe("isSwitchCase and isTestFile", testSwitchAndTestFile);
  describe("isCallExpression", testIsCallExpression);
  describe("isLiteral", testIsLiteral);
  describe("isStringLiteral", testIsStringLiteral);
  describe("isBlockStatement", testIsBlockStatement);
  describe("isReturnStatement", testIsReturnStatement);
  describe("isFunctionLike", testIsFunctionLike);
  describe("isTSParameterProperty", testIsTSParameterProperty);
  describe("isTSEnumMember", testIsTSEnumMember);
  describe("isTSNonNullExpression", testIsTSNonNullExpression);
  describe("isTSTypeAnnotation", testIsTSTypeAnnotation);
  describe("isTSTypeReference", testIsTSTypeReference);
  describe("isTSTypeLiteral", testIsTSTypeLiteral);
  describe("isTSPropertySignature", testIsTSPropertySignature);
  describe("isTSAsExpression", testIsTSAsExpression);
  describe("isTSSatisfiesExpression", testIsTSSatisfiesExpression);
  describe("isThisExpression", testIsThisExpression);
  describe("isUnaryExpression", testIsUnaryExpression);
  describe("isUncomputedMemberExpression", testIsUncomputedMemberExpression);
  describe("variable guards", testVariableGuards);
  describe("alias exports", testAliasExports);
});
