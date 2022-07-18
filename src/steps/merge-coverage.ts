import { getOctokit, context } from "@actions/github";
import { create as createClient } from "@actions/artifact";
import { execSync } from "child_process";
import { info } from "console";
import { readFileSync } from "fs";
import { CoverageMetric, CoverageSummary } from "../types";
import { getCoverageArtifactName, getNthIndexOfCharacter, getSummaryTable, logException } from "../utils";
import { debug } from "@actions/core";
import { getOctokitForToken } from "../utils/octokit";

interface MergeCoverage {
  token: string;
  skipArtifactUpload: boolean;
  shardCount: number;
  showAllFilesInSummary: boolean;
}

export const mergeCoverage = async ({
  token,
  skipArtifactUpload,
  shardCount,
  showAllFilesInSummary,
}: MergeCoverage) => {
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

    const commentBody = getCommentBody(result, textSummary, showAllFilesInSummary);

    if (context.payload.pull_request) {
      await getOctokitForToken(token).rest.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body: commentBody,
      });
    } else {
      await getOctokitForToken(token).rest.repos.createCommitComment({
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

export const getCommentBody = (
  coverageSummary: CoverageSummary,
  textSummary: string,
  showAllFilesInSummary: boolean
): string => {
  const output: string[] = [];

  // Code Coverage Summary
  output.push("### Code Coverage Summary");
  output.push("");
  output.push(getSummaryTable(coverageSummary.total));

  if (showAllFilesInSummary) {
    // Code Coverage on All Files
    output.push(`<details>`);
    output.push(`  <summary>Code Coverage on All Files</summary>`);
    output.push("");
    output.push("### Code Coverage on All Files");

    const _textSummaryBody = getCoverageDetailsTable(textSummary, showAllFilesInSummary);
    output.push(_textSummaryBody);

    output.push(`</details>`);
    output.push("");
  }

  return output.join("\n");
};

const getCoverageDetailsTable = (textSummary: string, showAllFilesInSummary: boolean) => {
  let lines = textSummary.split("\n").slice(1).filter(Boolean);
  lines.pop();
  lines = lines
    .map((line) => {
      if (line.startsWith(" ")) {
        const match = line.match(/^\s+/);
        if (match) {
          line = line.replace(/^\s+/, "".padStart(match[0].length * 2, "─") + " ");
        }
      }

      line = line.replace(/(\d+([\.\-]\d+)*)/g, getFormattedValue);

      return line;
    })
    .filter(Boolean);

  if (lines[1].startsWith("--")) {
    lines[1] = `---|--:|---:|--:|--:|---`;
  }

  return lines.join("\n");
};

export const getFormattedValue = (value: string, ...args) => {
  if (!value) return "";

  const matchedIndex = args[2];
  const line = args[3];

  const lastColumnOffset = getNthIndexOfCharacter(line, "|", 5);
  if (lastColumnOffset < matchedIndex) {
    return `\`${value}\``;
  }

  return `\`${Number(value).toFixed(2)}\``;
};
