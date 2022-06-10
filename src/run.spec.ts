import * as mockedActionsCore from "@actions/core";
import { run } from "./run";
import * as mockedStepsMergeCoverage from "./steps/merge-coverage";
import * as mockedStepsRunTests from "./steps/run-tests";

describe("run", () => {
  describe("happy path: run-tests", () => {
    let spyOnGetInput: jest.SpyInstance;
    let spyOnGetBooleanInput: jest.SpyInstance;
    let spyOnRunTests: jest.SpyInstance;

    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeAll(() => {
      spyOnGetInput = jest
        .spyOn(mockedActionsCore, "getInput")
        .mockReturnValueOnce("run-tests")
        .mockReturnValueOnce("1/2");
      spyOnGetBooleanInput = jest
        .spyOn(mockedActionsCore, "getBooleanInput")
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      spyOnRunTests = jest.spyOn(mockedStepsRunTests, "runTests").mockImplementation(jest.fn());
    });

    it("should route commands", () => {
      run();

      expect(spyOnGetInput).toHaveBeenNthCalledWith(1, "command");
      expect(spyOnGetInput).toHaveBeenNthCalledWith(2, "shard");

      expect(spyOnGetBooleanInput).toHaveBeenNthCalledWith(1, "coverage");
      expect(spyOnGetBooleanInput).toHaveBeenNthCalledWith(2, "skip-artifact-upload");
      expect(spyOnRunTests).toHaveBeenCalledWith({
        coverage: true,
        shard: "1/2",
        skipArtifactUpload: false,
      });
    });
  });

  describe("happy path: merge-coverage", () => {
    let spyOnGetInput: jest.SpyInstance;
    let spyOnGetBooleanInput: jest.SpyInstance;
    let spyOnMergeCoverage: jest.SpyInstance;

    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeAll(() => {
      spyOnGetInput = jest
        .spyOn(mockedActionsCore, "getInput")
        .mockReturnValueOnce("merge-coverage")
        .mockReturnValueOnce("fake-token")
        .mockReturnValueOnce("3");

      spyOnGetBooleanInput = jest.spyOn(mockedActionsCore, "getBooleanInput").mockReturnValueOnce(true);
      spyOnMergeCoverage = jest.spyOn(mockedStepsMergeCoverage, "mergeCoverage").mockImplementation(jest.fn());
    });

    it("should route commands", () => {
      run();

      expect(spyOnGetInput).toHaveBeenNthCalledWith(1, "command");
      expect(spyOnGetInput).toHaveBeenNthCalledWith(2, "github-token");
      expect(spyOnGetInput).toHaveBeenNthCalledWith(3, "shard-count");

      expect(spyOnGetBooleanInput).toHaveBeenNthCalledWith(1, "skip-artifact-upload");

      expect(spyOnMergeCoverage).toHaveBeenCalledWith({
        shardCount: 3,
        skipArtifactUpload: true,
        token: "fake-token",
      });
    });
  });

  describe("sad path", () => {
    let spyOnError: jest.SpyInstance;
    let spyOnGetInput: jest.SpyInstance;
    let spyOnSetFailed: jest.SpyInstance;

    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeAll(() => {
      spyOnError = jest.spyOn(mockedActionsCore, "error").mockReturnValue();
      spyOnGetInput = jest.spyOn(mockedActionsCore, "getInput").mockReturnValue("invalid-command");
      spyOnSetFailed = jest.spyOn(mockedActionsCore, "setFailed").mockReturnValue();
    });

    it("should route commands", () => {
      run();

      expect(spyOnGetInput).toHaveBeenCalledWith("command");
      expect(spyOnSetFailed).toHaveBeenCalledWith("Invalid command: invalid-command");
      expect(spyOnError).toHaveBeenCalledWith("Invalid command: invalid-command");
    });
  });
});
