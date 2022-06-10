import { getOctokit, context } from "@actions/github";
import { create as createClient } from "@actions/artifact";
import { execSync } from "child_process";
import { info } from "console";
import { readFileSync } from "fs";
import { CoverageMetric, CoverageSummary } from "../types";
import { getCoverageArtifactName, getSummaryTable, logException } from "../utils";
import { debug } from "@actions/core";
import { getOctokitForToken } from "../utils/octokit";

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
    const output = execSync(
      "npx --yes nyc report --reporter=json-summary --reporter=text -t coverage --report-dir coverage-merged"
    );

    const textSummary = output.toString();

    info("Text Summary:");
    info(textSummary);

    const summary = readFileSync("./coverage-merged/coverage-summary.json");

    const result = JSON.parse(summary.toString()) as CoverageSummary;

    if (!token.trim()) {
      throw new Error("token not found");
    }

    const commentBody = getCommentBody(result, textSummary);

    if (context.payload.pull_request) {
      getOctokitForToken(token).rest.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body: commentBody,
      });
    } else {
      getOctokitForToken(token).rest.repos.createCommitComment({
        ...context.repo,
        commit_sha: context.sha,
        body: commentBody,
      });
    }

    info("Merging coverage... DONE");
  } catch (exception) {
    logException(exception);
  }
};

export const getCommentBody = (coverageSummary: CoverageSummary, textSummary: string): string => {
  const output = [];

  // Code Coverage Summary
  output.push("### Code Coverage Summary");
  output.push("");
  output.push(getSummaryTable(coverageSummary.total));

  // Code Coverage on All Files
  output.push(`<details>`);
  output.push(`  <summary>Code Coverage on All Files</summary>`);
  output.push("");
  output.push("### Code Coverage on All Files");

  const _textSummaryBody = removeFirstAndLastLines(textSummary);
  output.push(_textSummaryBody);

  output.push(`</details>`);
  output.push("");

  return output.join("\n");
};

const removeFirstAndLastLines = (textSummary: string) => {
  let lines = textSummary.split("\n").slice(1).filter(Boolean);
  lines.pop();
  lines = lines.map((line) => {
    if (line.startsWith(" ")) {
      const match = line.match(/^\s+/);
      if (match) {
        line = line.replace(/^\s+/, "".padStart(match[0].length * 2, "─") + " ");
      }
    }

    return line;
  });

  return lines.join("\n");
};
