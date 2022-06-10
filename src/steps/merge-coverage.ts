import { getOctokit, context } from "@actions/github";
import { create as createClient } from "@actions/artifact";
import { execSync } from "child_process";
import { info } from "console";
import { readFileSync } from "fs";
import { SummaryTotal } from "../types";
import { getCoverageArtifactName, getSummaryTable, logException } from "../utils";
import { debug } from "@actions/core";

interface MergeCoverage {
  token: string;
  skipArtifactUpload: boolean;
  shardCount: number;
}

export const mergeCoverage = async ({ token, skipArtifactUpload, shardCount }: MergeCoverage) => {
  info(`Merging coverage...`);

  try {
    if (!skipArtifactUpload) {
      const artifactClient = createClient();
      for (let i = 1; i <= shardCount; i++) {
        const downloadOutput = await artifactClient.downloadArtifact(getCoverageArtifactName(i));
        debug(`downloadOutput: ${JSON.stringify(downloadOutput)}`);
      }
    }

    // TODO: check if file exists
    const output = execSync("npx --yes nyc report --reporter json-summary -t coverage --report-dir coverage-merged");
    info(output.toString());

    const summary = readFileSync("./coverage-merged/coverage-summary.json");
    info("Coverage summary:");
    info(JSON.stringify(summary));

    const result = JSON.parse(summary.toString()) as { total: SummaryTotal };

    if (!token.trim()) {
      throw new Error("token not found");
    }

    if (context.payload.pull_request) {
      getOctokit(token).rest.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body: getCommentBody(result.total),
      });
    } else {
      getOctokit(token).rest.repos.createCommitComment({
        ...context.repo,
        commit_sha: context.sha,
        body: getCommentBody(result.total),
      });
    }

    info("Merging coverage... DONE");
  } catch (exception) {
    logException(exception);
  }
};

export const getCommentBody = (summaryTotal: SummaryTotal): string => {
  const output = [];

  output.push("### Code Coverage");
  output.push("");
  output.push(getSummaryTable(summaryTotal));

  return output.join("\n");
};
