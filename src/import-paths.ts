const PARENT_DIRECTORY_IMPORT = "..";
const PARENT_DIRECTORY_IMPORT_PREFIX = "../";

/**
 * Get the last path segment from a file path.
 * @param filePath - The path to inspect.
 * @returns The filename portion of the path.
 */
export function getFilename(filePath: string): string {
  const lastSeparator = Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\"));
  return filePath.slice(lastSeparator + 1);
}

/**
 * Check whether a file path points to a simple barrel index file.
 * @param filePath - The path to inspect.
 * @returns True when the file is a simple `index.*` file.
 */
export function isBarrelFile(filePath: string): boolean {
  return /^index\.\w+$/u.test(getFilename(filePath));
}

/**
 * Check whether an import path traverses to a parent directory.
 * @param importPath - The import path to inspect.
 * @returns True when the path is `..` or begins with `../`.
 */
export function isParentDirectoryImportPath(importPath: string): boolean {
  return importPath === PARENT_DIRECTORY_IMPORT || importPath.startsWith(PARENT_DIRECTORY_IMPORT_PREFIX);
}
