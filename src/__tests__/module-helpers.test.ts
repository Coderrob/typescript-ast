import { AST_NODE_TYPES, AST_TOKEN_TYPES, TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import {
  getCallMemberMethodName,
  getFilename,
  getFunctionDeclarationName,
  getFunctionMethodName,
  getFunctionVariableName,
  getIdentifierName,
  getJsdocComment,
  getLineIndentation,
  getMappedMemberPropertyName,
  getMemberPropertyName,
  getOptionMaxValue,
  getTargetNode,
  getVariableOwnedTargetNode,
  getVisitorChildNodes,
  isBarrelFile,
  isBoolean,
  isDefined,
  isJsdocBlockComment,
  isNullOrUndefined,
  isNumber,
  isParentDirectoryImportPath,
  isParentOwnedTargetType,
  isPlainObject,
  isStandaloneLineTarget,
  isString,
  resolveFunctionName,
} from "..";
import {
  asArrowFunctionExpression,
  asBinaryExpression,
  asCallExpression,
  asClassDeclaration,
  asExpressionStatement,
  asFunctionDeclaration,
  asFunctionExpression,
  asIdentifier,
  asMethodDefinition,
  asVariableDeclaration,
  asVariableDeclarator,
  attachParents,
} from "./helpers";

function parseProgWithParents(code: string): TSESTree.Program {
  const ast = parse(code, { jsx: false });
  attachParents(ast);
  return ast;
}

describe("module helpers", () => {
  it("should cover import-path helpers", () => {
    expect(getFilename("C:\\src\\rules\\no-export-alias.ts")).toBe("no-export-alias.ts");
    expect(isBarrelFile("/src/index.ts")).toBe(true);
    expect(isBarrelFile("/src/index.d.ts")).toBe(false);
    expect(isParentDirectoryImportPath("../module")).toBe(true);
    expect(isParentDirectoryImportPath("react")).toBe(false);
  });

  it("should cover runtime value guards", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isDefined(false)).toBe(true);
    expect(isNullOrUndefined(undefined)).toBe(true);
    expect(isNumber(42)).toBe(true);
    expect(isString("value")).toBe(true);
    expect(isPlainObject({ key: "value" })).toBe(true);
    expect(isPlainObject(new Date())).toBe(false);
  });

  it("should cover AST helper utilities", () => {
    const identExpr = asIdentifier(asExpressionStatement(parse("foo;", { jsx: false }).body[0]).expression);
    expect(getIdentifierName(identExpr)).toBe("foo");

    const fnDecl = asFunctionDeclaration(parse("function myFunc() {}", { jsx: false }).body[0]);
    expect(getFunctionDeclarationName(fnDecl)).toBe("myFunc");

    const classAst = parseProgWithParents("class C { render() {} }");
    const methodFn = asFunctionExpression(asMethodDefinition(asClassDeclaration(classAst.body[0]).body.body[0]).value);
    expect(getFunctionMethodName(methodFn)).toBe("render");

    const varAst = parseProgWithParents("const myVar = () => {};");
    const variableFn = asArrowFunctionExpression(asVariableDeclarator(asVariableDeclaration(varAst.body[0]).declarations[0]).init);
    expect(getFunctionVariableName(variableFn)).toBe("myVar");

    expect(getMemberPropertyName({ computed: true, property: { type: "Literal", value: "splice" } })).toBe("splice");

    const callExpr = asCallExpression(asExpressionStatement(parse("foo['splice']();", { jsx: false }).body[0]).expression);
    expect(getCallMemberMethodName(callExpr)).toBe("splice");

    expect(
      getMappedMemberPropertyName(
        { computed: false, property: { type: "Identifier", name: "mockImplementation" } },
        { mockImplementation: "mockImplementationOnce" }
      )
    ).toEqual({ name: "mockImplementation", replacement: "mockImplementationOnce" });

    expect(getOptionMaxValue({ max: 5 })).toBe(5);

    const binExpr = asBinaryExpression(asExpressionStatement(parse("left + right;", { jsx: false }).body[0]).expression);
    const binChildren = getVisitorChildNodes(binExpr, { visitorKeys: { BinaryExpression: ["left", "right"] } });
    expect(binChildren).toHaveLength(2);
    expect(binChildren[0]?.type).toBe(AST_NODE_TYPES.Identifier);
    expect(binChildren[1]?.type).toBe(AST_NODE_TYPES.Identifier);

    const anonymousAst = parseProgWithParents("foo(() => {});");
    const anonymousFn = asArrowFunctionExpression(asCallExpression(asExpressionStatement(anonymousAst.body[0]).expression).arguments[0]);
    expect(resolveFunctionName(anonymousFn)).toBe("<anonymous>");
  });

  it("should cover JSDoc helpers", () => {
    const jsdoc: TSESTree.Comment = {
      type: AST_TOKEN_TYPES.Block,
      value: "* description",
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 20 } },
      range: [0, 20],
    };
    const node = asFunctionDeclaration(parse("  function foo() {}", { jsx: false, loc: true }).body[0]);

    expect(isJsdocBlockComment(jsdoc)).toBe(true);
    expect(isParentOwnedTargetType(AST_NODE_TYPES.MethodDefinition)).toBe(true);
    expect(
      getJsdocComment(
        { lines: ["  function foo() {}"], getCommentsBefore: () => [jsdoc] },
        node
      )
    ).toBe(jsdoc);
    expect(
      getLineIndentation(
        { lines: ["  function foo() {}"], getCommentsBefore: () => [] },
        node
      )
    ).toBe("  ");
    expect(
      isStandaloneLineTarget(
        { lines: ["  function foo() {}"], getCommentsBefore: () => [] },
        node
      )
    ).toBe(true);

    const varJsdocAst = parseProgWithParents("const myVar = () => {};");
    const varDecl = asVariableDeclaration(varJsdocAst.body[0]);
    const varFn = asArrowFunctionExpression(asVariableDeclarator(varDecl.declarations[0]).init);
    expect(getVariableOwnedTargetNode(varFn)).toBe(varDecl);
    expect(getTargetNode(varFn)).toBe(varDecl);
  });
});

