import * as mockedFs from "fs";
import { getCoverageDetailsTable, mergeCoverage } from "./merge-coverage";
import { coverageSummary, execSyncOutput } from "./__sample__";
import * as mockedOctokit from "../utils/octokit";
import * as mockedUtils from "../utils";
import { GitHub } from "@actions/github/lib/utils";
import * as mockedChildProcess from "child_process";
import * as mockedActionsGithub from "@actions/github";

describe("merge-coverage", () => {
  describe("default", () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });

    const spyOnCreateIssueComment = jest.fn();
    const spyOnCreateCommitComment = jest.fn();

    beforeAll(() => {
      jest.spyOn(mockedFs, "readFileSync").mockReturnValue(Buffer.from(JSON.stringify(coverageSummary)));

      jest.spyOn(mockedChildProcess, "execSync").mockReturnValue(execSyncOutput);

      jest.spyOn(mockedUtils, "getCoverageArtifactName").mockReturnValue("artifact-1");
      jest.spyOn(mockedUtils, "getSummaryTable").mockReturnValue("<table>");
      jest.spyOn(mockedUtils, "logException").mockReturnValue();

      jest.spyOn(mockedOctokit, "getOctokitForToken").mockReturnValue({
        rest: {
          repos: { createCommitComment: spyOnCreateCommitComment } as any,
          issues: { createComment: spyOnCreateIssueComment } as any,
        },
      } as InstanceType<typeof GitHub>);
    });

    it("should output merged coverage", async () => {
      await mergeCoverage({
        token: "fake-token",
        skipArtifactUpload: true,
        shardCount: 2,
        showAllFilesInSummary: false,
      });
    });
  });

  describe("skipArtifactUpload: false, showAllFilesInSummary: true", () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeAll(() => {
      jest.spyOn(mockedFs, "readFileSync").mockReturnValue(Buffer.from(JSON.stringify(coverageSummary)));

      const spyOnCreateIssueComment = jest.fn();
      const spyOnCreateCommitComment = jest.fn();

      jest.spyOn(mockedChildProcess, "execSync").mockReturnValue(execSyncOutput);

      jest.spyOn(mockedUtils, "getCoverageArtifactName").mockReturnValue("artifact-1");
      jest.spyOn(mockedUtils, "getSummaryTable").mockReturnValue("<table>");
      jest.spyOn(mockedUtils, "logException").mockReturnValue();

      jest.spyOn(mockedOctokit, "getOctokitForToken").mockReturnValue({
        rest: {
          repos: { createCommitComment: spyOnCreateCommitComment } as any,
          issues: { createComment: spyOnCreateIssueComment } as any,
        },
      } as InstanceType<typeof GitHub>);
    });

    it("should output merged coverage", async () => {
      await mergeCoverage({
        token: "fake-token",
        skipArtifactUpload: false,
        shardCount: 2,
        showAllFilesInSummary: true,
      });

      expect(true).toBe(true);
    });
  });
});

describe("getCoverageDetailsTable", () => {
  it("should return formatted table", () => {
    const coverageSummary = execSyncOutput;
    const table = getCoverageDetailsTable(coverageSummary);

    expect(table).toMatchSnapshot();
  });
});
