/**
 * Check whether a value is a boolean primitive.
 * @param value - The value to inspect.
 * @returns True when the value is a boolean.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Check whether a value is neither null nor undefined.
 * @param value - The value to inspect.
 * @returns True when the value is defined.
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check whether a value is null or undefined.
 * @param value - The value to inspect.
 * @returns True when the value is nullish.
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check whether a value is a number primitive.
 * @param value - The value to inspect.
 * @returns True when the value is a number.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

/**
 * Check whether a value is a plain object with an object or null prototype.
 * @param value - The value to inspect.
 * @returns True when the value is a plain object.
 */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}

/**
 * Check whether a value is a string primitive.
 * @param value - The value to inspect.
 * @returns True when the value is a string.
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}
