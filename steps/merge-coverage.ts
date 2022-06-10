import { getOctokit, context } from "@actions/github";
import { create as createClient } from "@actions/artifact";
import { execSync } from "child_process";
import { info } from "console";
import { readFileSync } from "fs";
import { SummaryTotal } from "../types";
import { getSummaryTable, logException } from "../utils";

interface MergeCoverage {
  token: string;
  skipArtifactUpload: boolean;
}

export const mergeCoverage = async ({ token, skipArtifactUpload }: MergeCoverage) => {
  info(`Merging coverage...`);

  try {
    // TODO: check if file exists
    const output = execSync("npx --yes nyc report --reporter json-summary -t coverage --report-dir coverage-merged");

    info(output.toString());

    if (!skipArtifactUpload) {
      const artifactClient = createClient();
      artifactClient.downloadAllArtifacts();
    }

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
