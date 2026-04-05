import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { parse } from "@typescript-eslint/typescript-estree";
import { visitorKeys } from "@typescript-eslint/visitor-keys";
import {
  getCallMemberMethodName,
  getFunctionDeclarationName,
  getFunctionMethodName,
  getFunctionVariableName,
  getIdentifierName,
  getLiteralStringValue,
  getMappedMemberPropertyName,
  getMemberPropertyName,
  getOptionMaxValue,
  getVisitorChildNodes,
  resolveFunctionName,
} from "../ast/helpers";
import {
  asCallExpression,
  asClassDeclaration,
  asExpressionStatement,
  asFunctionDeclaration,
  asFunctionExpression,
  asIdentifier,
  asMemberExpression,
  asMethodDefinition,
  asVariableDeclaration,
  attachParents,
} from "./test-helpers";

const TWO_CHILDREN = 2;
const THREE_CHILDREN = 3;

function parseExpression(code: string): TSESTree.Expression {
  return asExpressionStatement(parse(code, { jsx: false }).body[0]).expression;
}

function parseProgramWithParents(code: string): TSESTree.Program {
  const ast = parse(code, { jsx: false });
  attachParents(ast);
  return ast;
}

describe("ast/helpers", () => {
  describe("getCallMemberMethodName", () => {
    it("should resolve identifier and string-computed member methods", () => {
      expect(getCallMemberMethodName(asCallExpression(parseExpression("obj.method()")))).toBe("method");
      expect(getCallMemberMethodName(asCallExpression(parseExpression('obj["method"]()')))).toBe("method");
    });

    it("should return null for non-member and unsupported computed calls", () => {
      expect(getCallMemberMethodName(asCallExpression(parseExpression("fn()")))).toBeNull();
      expect(getCallMemberMethodName(asCallExpression(parseExpression("obj[prop]()")))).toBeNull();
    });
  });

  describe("function name helpers", () => {
    it("should resolve declaration names", () => {
      const fn = asFunctionDeclaration(parse("function declared() {}", { jsx: false }).body[0]);
      expect(getFunctionDeclarationName(fn)).toBe("declared");
    });

    it("should resolve variable and method names from runtime parents", () => {
      const variableAst = parseProgramWithParents("const variableName = function () {}; ");
      const variableFn = asFunctionExpression(asVariableDeclaration(variableAst.body[0]).declarations[0].init);
      expect(getFunctionVariableName(variableFn)).toBe("variableName");

      const classAst = parseProgramWithParents("class C { methodName() {} }");
      const cls = asClassDeclaration(classAst.body[0]);
      const methodFn = asFunctionExpression(asMethodDefinition(cls.body.body[0]).value);
      expect(getFunctionMethodName(methodFn)).toBe("methodName");
    });

    it("should return null when a function has no corresponding parent owner", () => {
      const fn = asFunctionDeclaration(parse("function standalone() {}", { jsx: false }).body[0]);
      expect(getFunctionMethodName(fn)).toBeNull();
      expect(getFunctionVariableName(fn)).toBeNull();
    });
  });

  describe("identifier and literal helpers", () => {
    it("should resolve identifier names", () => {
      expect(getIdentifierName(asIdentifier(parseExpression("myId")))).toBe("myId");
      expect(getIdentifierName(parseExpression("1"))).toBeNull();
    });

    it("should resolve literal string values", () => {
      expect(getLiteralStringValue({ type: "Literal", value: "value" })).toBe("value");
      expect(getLiteralStringValue({ type: "Literal", value: 1 })).toBeNull();
      expect(getLiteralStringValue({ type: "Identifier", value: "value" })).toBeNull();
    });
  });

  describe("member property helpers", () => {
    it("should resolve member property names", () => {
      expect(getMemberPropertyName(asMemberExpression(parseExpression("obj.prop")))).toBe("prop");
      expect(getMemberPropertyName(asMemberExpression(parseExpression('obj["prop"]')))).toBe("prop");
      expect(getMemberPropertyName(asMemberExpression(parseExpression("obj[value]")))).toBeNull();
    });

    it("should resolve mapped member property names", () => {
      const member = asMemberExpression(parseExpression("obj.prop"));
      expect(getMappedMemberPropertyName(member, { prop: "replacement" })).toEqual({
        name: "prop",
        replacement: "replacement",
      });
      expect(getMappedMemberPropertyName(member, { other: "replacement" })).toBeNull();
    });

    it("should return null when mapped-property lookup has no resolvable member name", () => {
      const unresolvedMember = asMemberExpression(parseExpression("obj[prop]"));
      expect(getMappedMemberPropertyName(unresolvedMember, { prop: "replacement" })).toBeNull();
    });
  });

  describe("getOptionMaxValue", () => {
    it("should return max when option is a plain object", () => {
      expect(getOptionMaxValue({ max: THREE_CHILDREN })).toBe(THREE_CHILDREN);
    });

    it("should return undefined for non-plain objects", () => {
      expect(getOptionMaxValue([1, TWO_CHILDREN, THREE_CHILDREN])).toBeUndefined();
      expect(getOptionMaxValue(null)).toBeUndefined();
    });
  });

  describe("getVisitorChildNodes", () => {
    it("should collect child nodes from visitor keys", () => {
      const call = asCallExpression(parseExpression("foo(bar)"));
      const children = getVisitorChildNodes(call, { visitorKeys });
      expect(children.length).toBe(TWO_CHILDREN);
      expect(children.map((child) => child.type)).toEqual(["Identifier", "Identifier"]);
    });

    it("should ignore non-node values and unknown node types", () => {
      const call = asCallExpression(parseExpression("foo()"));
      Reflect.set(call, "type", "CustomNode");
      Reflect.set(call, "value", "not-a-node");
      const children = getVisitorChildNodes(call, {
        visitorKeys: { CustomNode: ["value", "items"] },
      });
      expect(children).toEqual([]);
    });
  });

  describe("resolveFunctionName", () => {
    it("should prioritize declaration, variable, and method names", () => {
      const declaration = asFunctionDeclaration(parse("function declared() {}", { jsx: false }).body[0]);
      expect(resolveFunctionName(declaration)).toBe("declared");

      const variableAst = parseProgramWithParents("const variableName = function () {}; ");
      const variableFn = asFunctionExpression(asVariableDeclaration(variableAst.body[0]).declarations[0].init);
      expect(resolveFunctionName(variableFn)).toBe("variableName");

      const classAst = parseProgramWithParents("class C { methodName() {} }");
      const cls = asClassDeclaration(classAst.body[0]);
      const methodFn = asFunctionExpression(asMethodDefinition(cls.body.body[0]).value);
      expect(resolveFunctionName(methodFn)).toBe("methodName");
    });

    it("should fall back to anonymous name", () => {
      const anonymousArrow = parseExpression("(() => {})");
      if (anonymousArrow.type !== AST_NODE_TYPES.ArrowFunctionExpression) {
        throw new Error("Expected ArrowFunctionExpression");
      }
      expect(resolveFunctionName(anonymousArrow)).toBe("<anonymous>");
    });
  });
});
