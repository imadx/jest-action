import { getOctokit, context } from "@actions/github";
import { create as createClient } from "@actions/artifact";
import { execSync } from "child_process";
import { info } from "console";
import { readFileSync } from "fs";
import { SummaryTotal } from "../types";
import { getCoverageArtifactName, getSummaryTable, logException } from "../utils";

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
        await artifactClient.downloadArtifact(getCoverageArtifactName(i));
      }
    }

    // TODO: check if file exists
    const output = execSync("npx --yes nyc report --reporter json-summary -t coverage --report-dir coverage-merged");
    info(output.toString());

    const summary = readFileSync("./coverage-merged/coverage-summary.json");
    const result = JSON.parse(summary.toString()) as { total: SummaryTotal };

    if (!token.trim()) {
      throw new Error("token not found");
    }

    getOctokit(token).rest.repos.createCommitComment({
      ...context.repo,
      commit_sha: context.sha,
      body: getCommentBody(result.total),
    });

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
