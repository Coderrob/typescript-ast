// @ts-check
"use strict";

const { Bench } = require("tinybench");
const { parse } = require("@typescript-eslint/typescript-estree");
const { AST_NODE_TYPES } = require("@typescript-eslint/types");
const { visitorKeys } = require("@typescript-eslint/visitor-keys");
const lib = require("../dist/index.cjs");

const astSimple = parse('foo("x")', { comment: true, jsx: false, loc: true, range: true });
const astMember = parse('foo.bar.baz("x")', { comment: true, jsx: false, loc: true, range: true });
const astNested = parse("a(b(c(d(e()))))", { comment: true, jsx: false, loc: true, range: true });
const astFunction = parse("function outer() { function inner() { return true; } return inner(); }", {
  comment: true,
  jsx: false,
  loc: true,
  range: true,
});
const astParameters = parse("function params(this: Ctx, name: string, { id }: { id: number }) { return name; }", {
  comment: true,
  jsx: false,
  loc: true,
  range: true,
});
const astTypes = parse("type Box = Promise<string>; const wrapped = (value as unknown as string)!;", {
  comment: true,
  jsx: false,
  loc: true,
  range: true,
});

const simpleExpression = astSimple.body[0];
const memberExpression = astMember.body[0];
const nestedExpression = astNested.body[0];
const functionDeclaration = astFunction.body[0];
const parameterFunction = astParameters.body[0];
const typeAlias = astTypes.body[0];
const wrappedDeclaration = astTypes.body[1];

const simpleCall =
  simpleExpression?.type === "ExpressionStatement" && simpleExpression.expression.type === "CallExpression"
    ? simpleExpression.expression
    : null;
const memberCall =
  memberExpression?.type === "ExpressionStatement" && memberExpression.expression.type === "CallExpression"
    ? memberExpression.expression
    : null;
const nestedCall =
  nestedExpression?.type === "ExpressionStatement" && nestedExpression.expression.type === "CallExpression"
    ? nestedExpression.expression
    : null;
const outerFunction = functionDeclaration?.type === "FunctionDeclaration" ? functionDeclaration : null;
const outerReturn = outerFunction?.body.body[1]?.type === "ReturnStatement" ? outerFunction.body.body[1] : null;
const innerReturn =
  outerFunction?.body.body[0]?.type === "FunctionDeclaration" &&
  outerFunction.body.body[0].body.body[0]?.type === "ReturnStatement"
    ? outerFunction.body.body[0].body.body[0]
    : null;

const typedFunction = parameterFunction?.type === "FunctionDeclaration" ? parameterFunction : null;
const namedParam = typedFunction?.params[1] ?? null;
const objectParam = typedFunction?.params[2] ?? null;

const typeReference =
  typeAlias?.type === "TSTypeAliasDeclaration" && typeAlias.typeAnnotation.type === "TSTypeReference"
    ? typeAlias.typeAnnotation
    : null;
const wrappedExpression =
  wrappedDeclaration?.type === "VariableDeclaration" &&
  wrappedDeclaration.declarations[0]?.type === "VariableDeclarator" &&
  wrappedDeclaration.declarations[0].init
    ? wrappedDeclaration.declarations[0].init
    : null;

const callIdentifier = simpleCall?.callee?.type === "Identifier" ? simpleCall.callee : null;
const memberCallee = memberCall?.callee?.type === "MemberExpression" ? memberCall.callee : null;

const jsdocComment = {
  type: "Block",
  value: "* benchmark",
};
const jsdocSourceCode = {
  lines: ["/** benchmark */", "function fn() {}"],
  getCommentsBefore() {
    return [jsdocComment];
  },
};

const ancestorChain = outerFunction
  ? [{ type: AST_NODE_TYPES.Program }, outerFunction, outerFunction.body, outerReturn].filter(Boolean)
  : [];

const bench = new Bench({ iterations: 100000 });

bench
  .add("getCalleeNamePath: member", () => {
    if (memberCall) {
      lib.getCalleeNamePath(memberCall.callee);
    }
  })
  .add("getStringLiteralCallArgument: first", () => {
    if (simpleCall) {
      lib.getStringLiteralCallArgument(simpleCall, 0);
    }
  })
  .add("hasCallCalleeNamePath: member", () => {
    if (memberCall) {
      lib.hasCallCalleeNamePath(memberCall, ["foo", "bar", "baz"]);
    }
  })
  .add("hasMemberCallee: member", () => {
    if (memberCall) {
      lib.hasMemberCallee(memberCall);
    }
  })
  .add("isNamedCall: simple", () => {
    if (simpleCall) {
      lib.isNamedCall(simpleCall, "foo");
    }
  })
  .add("getCallMemberMethodName: member", () => {
    if (memberCall) {
      lib.getCallMemberMethodName(memberCall);
    }
  })
  .add("getMemberPropertyName: member", () => {
    if (memberCallee) {
      lib.getMemberPropertyName(memberCallee);
    }
  })
  .add("getVisitorChildNodes: nested", () => {
    lib.getVisitorChildNodes(astNested, { visitorKeys });
  })
  .add("resolveFunctionName: declaration", () => {
    if (outerFunction) {
      lib.resolveFunctionName(outerFunction);
    }
  })
  .add("getJsdocComment: basic", () => {
    if (outerFunction) {
      lib.getJsdocComment(jsdocSourceCode, outerFunction);
    }
  })
  .add("isJsdocBlockComment: basic", () => {
    lib.isJsdocBlockComment(jsdocComment);
  })
  .add("findAncestor: function", () => {
    if (callIdentifier) {
      lib.findAncestor(callIdentifier, lib.isFunctionLike);
    }
  })
  .add("getParentBlockStatement: return", () => {
    if (innerReturn) {
      lib.getParentBlockStatement(innerReturn);
    }
  })
  .add("isInsideBoundary: ancestors", () => {
    lib.isInsideBoundary(
      ancestorChain,
      [AST_NODE_TYPES.Program],
      [AST_NODE_TYPES.FunctionDeclaration, AST_NODE_TYPES.ArrowFunctionExpression],
    );
  })
  .add("getNamedParameterIdentifier: identifier", () => {
    if (namedParam) {
      lib.getNamedParameterIdentifier(namedParam);
    }
  })
  .add("getObjectDestructuredParameterTypeNode: object", () => {
    if (objectParam) {
      lib.getObjectDestructuredParameterTypeNode(objectParam);
    }
  })
  .add("getParameterTypeAnnotation: identifier", () => {
    if (namedParam) {
      lib.getParameterTypeAnnotation(namedParam);
    }
  })
  .add("findDescendant: call", () => {
    lib.findDescendant(astNested, visitorKeys, lib.isCallExpression);
  })
  .add("hasMatchingDescendant: call", () => {
    lib.hasMatchingDescendant(astNested, visitorKeys, lib.isCallExpression);
  })
  .add("hasMatchingDescendantUntil: identifier", () => {
    lib.hasMatchingDescendantUntil(astNested, visitorKeys, lib.isIdentifier, () => false);
  })
  .add("getBooleanLiteralReturnValue: return", () => {
    if (innerReturn) {
      lib.getBooleanLiteralReturnValue(innerReturn);
    }
  })
  .add("getReturnStatement: return", () => {
    if (innerReturn) {
      lib.getReturnStatement(innerReturn);
    }
  })
  .add("unwrapTsExpression: wrapped", () => {
    if (wrappedExpression) {
      lib.unwrapTsExpression(wrappedExpression);
    }
  })
  .add("isNamedTypeReference: promise", () => {
    lib.isNamedTypeReference(typeReference, "Promise");
  })
  .add("hasTypeArguments: promise", () => {
    if (typeReference) {
      lib.hasTypeArguments(typeReference);
    }
  })
  .add("isCallExpression: simple", () => {
    lib.isCallExpression(simpleCall);
  })
  .add("isIdentifier: callee", () => {
    lib.isIdentifier(callIdentifier);
  })
  .add("isTestFile: convention", () => {
    lib.isTestFile("src/__tests__/bench.test.ts");
  })
  .add("isUncomputedMemberExpression: callee", () => {
    lib.isUncomputedMemberExpression(memberCallee);
  })
  .add("getFilename: path", () => {
    lib.getFilename("src/ast/calls.ts");
  })
  .add("isBarrelFile: index", () => {
    lib.isBarrelFile("index.ts");
  })
  .add("isParentDirectoryImportPath: relative", () => {
    lib.isParentDirectoryImportPath("../ast/calls");
  });

bench.run().then(() => {
  console.table(
    bench.tasks.map((task) => {
      const r = task.result;
      return {
        "Task Name": task.name,
        "ops/sec": r ? Math.round(r.throughput.mean).toLocaleString() : "N/A",
        "avg (ns)": r ? (r.latency.mean * 1e6).toFixed(0) : "N/A",
        Margin: r ? `\u00b1${r.latency.rme.toFixed(2)}%` : "N/A",
      };
    }),
  );
});
