import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
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
    const methodFn = {
      type: "FunctionExpression",
      parent: {
        type: "MethodDefinition",
        key: { type: "Identifier", name: "render" },
      },
    } as unknown as TSESTree.FunctionExpression;
    const variableFn = {
      type: "ArrowFunctionExpression",
      parent: {
        type: "VariableDeclarator",
        id: { type: "Identifier", name: "myVar" },
      },
    } as unknown as TSESTree.ArrowFunctionExpression;
    const member = {
      type: "MemberExpression",
      computed: true,
      property: { type: "Literal", value: "splice" },
    } as unknown as TSESTree.MemberExpression;

    expect(getIdentifierName({ type: "Identifier", name: "foo" } as TSESTree.Node)).toBe("foo");
    expect(
      getFunctionDeclarationName({
        type: "FunctionDeclaration",
        id: { type: "Identifier", name: "myFunc" },
      } as unknown as TSESTree.FunctionDeclaration)
    ).toBe("myFunc");
    expect(getFunctionMethodName(methodFn)).toBe("render");
    expect(getFunctionVariableName(variableFn)).toBe("myVar");
    expect(getMemberPropertyName(member)).toBe("splice");
    expect(getCallMemberMethodName({ callee: member } as TSESTree.CallExpression)).toBe("splice");
    expect(
      getMappedMemberPropertyName(
        {
          computed: false,
          property: { type: "Identifier", name: "mockImplementation" },
        },
        { mockImplementation: "mockImplementationOnce" }
      )
    ).toEqual({ name: "mockImplementation", replacement: "mockImplementationOnce" });
    expect(getOptionMaxValue({ max: 5 })).toBe(5);
    expect(
      getVisitorChildNodes(
        {
          type: "BinaryExpression",
          left: { type: "Identifier", name: "left" },
          right: { type: "Identifier", name: "right" },
          extras: [{ type: "Literal", value: 1 }, "not-a-node"],
        } as unknown as TSESTree.Node,
        { visitorKeys: { BinaryExpression: ["left", "right", "extras"] } }
      )
    ).toEqual([
      { type: "Identifier", name: "left" },
      { type: "Identifier", name: "right" },
      { type: "Literal", value: 1 },
    ]);
    expect(
      resolveFunctionName({
        type: "ArrowFunctionExpression",
        parent: { type: "CallExpression" },
      } as unknown as TSESTree.ArrowFunctionExpression)
    ).toBe("<anonymous>");
  });

  it("should cover JSDoc helpers", () => {
    const jsdoc = { type: "Block", value: "* description" } as TSESTree.Comment;
    const node = { loc: { start: { line: 1, column: 2 } } } as unknown as TSESTree.Node;
    const declaration = {
      type: "VariableDeclaration",
      declarations: [{}],
      parent: { type: "Program" },
    };
    const declarator = {
      type: "VariableDeclarator",
      parent: declaration,
    };
    const fn = {
      type: "ArrowFunctionExpression",
      parent: declarator,
    } as unknown as TSESTree.ArrowFunctionExpression;

    expect(isJsdocBlockComment(jsdoc)).toBe(true);
    expect(isParentOwnedTargetType(AST_NODE_TYPES.MethodDefinition)).toBe(true);
    expect(
      getJsdocComment(
        {
          lines: ["  function foo() {}"],
          getCommentsBefore: () => [jsdoc],
        },
        node
      )
    ).toBe(jsdoc);
    expect(
      getLineIndentation(
        {
          lines: ["  function foo() {}"],
          getCommentsBefore: () => [],
        },
        node
      )
    ).toBe("  ");
    expect(
      isStandaloneLineTarget(
        {
          lines: ["  function foo() {}"],
          getCommentsBefore: () => [],
        },
        node
      )
    ).toBe(true);
    expect(getVariableOwnedTargetNode(fn)).toBe(declaration);
    expect(getTargetNode(fn)).toBe(declaration);
  });
});
