import { getFilename, isBarrelFile, isParentDirectoryImportPath } from "../import-paths";

describe("import-paths", () => {
  describe("getFilename", () => {
    it("should return filename for POSIX paths", () => {
      expect(getFilename("src/utils/file.ts")).toBe("file.ts");
    });

    it("should return filename for Windows paths", () => {
      expect(getFilename(String.raw`src\utils\file.ts`)).toBe("file.ts");
    });

    it("should return the whole input when no separator exists", () => {
      expect(getFilename("file.ts")).toBe("file.ts");
    });
  });

  describe("isBarrelFile", () => {
    it("should return true for index files", () => {
      expect(isBarrelFile("src/index.ts")).toBe(true);
      expect(isBarrelFile("index.js")).toBe(true);
      expect(isBarrelFile("src/index.d.ts")).toBe(true);
    });

    it("should return false for non-index files", () => {
      expect(isBarrelFile("src/not-index.ts")).toBe(false);
      expect(isBarrelFile("src/index")).toBe(false);
    });
  });

  describe("isParentDirectoryImportPath", () => {
    it("should return true for parent-directory imports", () => {
      expect(isParentDirectoryImportPath("..")).toBe(true);
      expect(isParentDirectoryImportPath("../utils")).toBe(true);
    });

    it("should return false for non-parent imports", () => {
      expect(isParentDirectoryImportPath("./utils")).toBe(false);
      expect(isParentDirectoryImportPath("utils")).toBe(false);
    });
  });
});
