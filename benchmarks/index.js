// @ts-check
"use strict";

const { Bench } = require("tinybench");
const { parse } = require("@typescript-eslint/typescript-estree");
const { visitorKeys } = require("@typescript-eslint/visitor-keys");
const lib = require("../dist/index");
const guards = require("../dist/guards/nodes");

const astSimple = parse("foo()", { jsx: false });
const astMember = parse("foo.bar.baz()", { jsx: false });
const astNested = parse("a(b(c(d(e()))))", { jsx: false });

const bench = new Bench({ iterations: 100000 });

bench
  .add("getCalleeNamePath — identifier", () => {
    const stmt = astSimple.body[0];
    if (stmt && stmt.type === "ExpressionStatement" && stmt.expression.type === "CallExpression") {
      lib.getCalleeNamePath(stmt.expression.callee);
    }
  })
  .add("getCalleeNamePath — member chain", () => {
    const stmt = astMember.body[0];
    if (stmt && stmt.type === "ExpressionStatement" && stmt.expression.type === "CallExpression") {
      lib.getCalleeNamePath(stmt.expression.callee);
    }
  })
  .add("isNamedCall — match", () => {
    const stmt = astSimple.body[0];
    if (stmt && stmt.type === "ExpressionStatement" && stmt.expression.type === "CallExpression") {
      lib.isNamedCall(stmt.expression, "foo");
    }
  })
  .add("hasMatchingDescendant — CallExpression", () => {
    lib.hasMatchingDescendant(astNested, visitorKeys, guards.isCallExpression);
  })
  .add("hasMatchingDescendantUntil — Identifier", () => {
    lib.hasMatchingDescendantUntil(astNested, visitorKeys, guards.isIdentifier, () => false);
  })
  .add("findDescendant — CallExpression", () => {
    lib.findDescendant(astNested, visitorKeys, guards.isCallExpression);
  });

bench.run().then(() => {
  console.table(
    bench.tasks.map((task) => {
      const r = task.result;
      return {
        "Task Name": task.name,
        "ops/sec": r ? Math.round(r.throughput.mean).toLocaleString() : "N/A",
        "avg (ns)": r ? (r.latency.mean * 1e6).toFixed(0) : "N/A",
        "Margin": r ? `\u00b1${r.latency.rme.toFixed(2)}%` : "N/A",
      };
    })
  );
});
