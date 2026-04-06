import * as typescript from "../typescript";

describe("typescript entry point", () => {
  it("should expose representative TypeScript helpers and guards", () => {
    expect(typescript.getParameterTypeAnnotation).toBeTypeOf("function");
    expect(typescript.isTSAsExpression).toBeTypeOf("function");
    expect(typescript.unwrapTsExpression).toBeTypeOf("function");
  });
});
