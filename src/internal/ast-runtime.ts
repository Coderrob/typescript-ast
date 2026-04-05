/**
 * Internal helpers for reading runtime-only AST node properties such as
 * `parent` references and optional source locations.
 */
import { isObject, isString } from "@coderrob/typescript-type-guards";
import { TSESTree } from "@typescript-eslint/types";

/**
 * Read a runtime parent reference from a node.
 * @param node - The node whose parent should be read.
 * @returns The parent node, or undefined.
 */
export function getNodeParent(node: Readonly<TSESTree.Node>): TSESTree.Node | undefined {
  const parent: unknown = Reflect.get(node, "parent");
  return isAstNode(parent) ? parent : undefined;
}

/**
 * Read a runtime parent reference from a node as a nullable value.
 * @param node - The node whose parent should be read.
 * @returns The parent node, or null.
 */
export function getNodeParentOrNull(node: Readonly<TSESTree.Node> | null | undefined): TSESTree.Node | null {
  return node ? (getNodeParent(node) ?? null) : null;
}

/**
 * Get a node start position when location data is available.
 * @param node - The node to inspect.
 * @returns The node start position, or null.
 */
export function getNodeStart(node: Readonly<TSESTree.Node>): TSESTree.Position | null {
  return node.loc?.start ?? null;
}

/**
 * Check whether a runtime value is an AST node.
 * @param value - The value to inspect.
 * @returns True when the value is node-like.
 */
export function isAstNode(value: unknown): value is TSESTree.Node {
  return isObject(value) && "type" in value && isString(Reflect.get(value, "type"));
}
