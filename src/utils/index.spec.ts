import { getCoverageArtifactName, getCoverageFileName, getString, getSummaryTable, logException, moveFile } from ".";
import * as mockedActionsIo from "@actions/io";
import * as mockedActionsCore from "@actions/core";

describe("utils", () => {
  describe("getString", () => {
    it("should return a string joined with spaces", () => {
      expect(getString("sample", undefined, null, "", "string")).toEqual("sample string");
    });
  });

  describe("moveFile", () => {
    it("should call mv from @actions/io", async () => {
      const spyOnMv = jest.spyOn(mockedActionsIo, "mv").mockResolvedValue();
      await moveFile("source", "destination");

      expect(spyOnMv).toHaveBeenCalledWith("source", "destination", { force: true });
    });
  });

  describe("getSummaryTable", () => {
    it("should output a markdown table", () => {
      expect(getSummaryTable(sampleSummaryTotal)).toMatchSnapshot();
    });
  });

  describe("getCoverageFileName", () => {
    it("should return output path", () => {
      expect(getCoverageFileName(1)).toEqual("coverage/coverage-shard-1.json");
    });
  });

  describe("getCoverageArtifactName", () => {
    it("should return output path", () => {
      expect(getCoverageArtifactName(1)).toEqual("coverage-shard-1");
    });
  });

  describe("logException", () => {
    const spyOnError = jest.spyOn(mockedActionsCore, "error").mockReturnValue();
    const spyOnSetError = jest.spyOn(mockedActionsCore, "setFailed").mockReturnValue();

    afterEach(() => {
      spyOnError.mockClear();
      spyOnSetError.mockClear();
    });

    it("should log error for Error", () => {
      logException(new Error("mocked-error"));

      expect(spyOnError).toHaveBeenCalledWith("mocked-error");
      expect(spyOnSetError).toHaveBeenCalledWith("mocked-error");
    });

    it("should log error for ExecError", () => {
      logException({ stdout: "mocked-stdout-error" });

      expect(spyOnError).toHaveBeenCalledWith("mocked-stdout-error");
      expect(spyOnSetError).toHaveBeenCalledWith("mocked-stdout-error");
    });
  });
});

const sampleSummaryTotal = {
  statements: { total: 100, covered: 100, skipped: 0, pct: 100 },
  branches: { total: 100, covered: 70, skipped: 0, pct: 70 },
  functions: { total: 100, covered: 50, skipped: 0, pct: 50 },
  lines: { total: 100, covered: 10, skipped: 0, pct: 10 },
};
