import { runTests } from "./run-tests";
import * as mockedExecSync from "child_process";
import * as mockedUtils from "../utils";

describe("run-tests", () => {
  describe("default", () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });

    const spyOnCreateIssueComment = jest.fn();
    const spyOnCreateCommitComment = jest.fn();

    beforeAll(() => {
      jest.spyOn(mockedExecSync, "execSync").mockReturnValue("output");
      jest.spyOn(mockedUtils, "moveFile").mockImplementation(jest.fn());
    });

    it("should output merged coverage", async () => {
      await runTests({ coverage: true, shard: "1/2", skipArtifactUpload: false });
    });
  });
});
