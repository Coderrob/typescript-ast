import * as core from "../core";

describe("core entry point", () => {
  it("should expose representative structural helpers", () => {
    expect(core.findAncestor).toBeTypeOf("function");
    expect(core.getBooleanLiteralReturnValue).toBeTypeOf("function");
    expect(core.getTargetNode).toBeTypeOf("function");
    expect(core.isIdentifier).toBeTypeOf("function");
    expect(core.isNamedCall).toBeTypeOf("function");
  });

  it("should not expose TypeScript-prefixed guards", () => {
    expect("isTSAsExpression" in core).toBe(false);
    expect("isTSEnumMember" in core).toBe(false);
    expect("isTSNonNullExpression" in core).toBe(false);
    expect("isTSTypeAnnotation" in core).toBe(false);
  });
});
