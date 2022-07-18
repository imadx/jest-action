import { error, getBooleanInput, getInput, setFailed } from "@actions/core";
import { info } from "console";
import { mergeCoverage } from "./steps/merge-coverage";
import { runTests } from "./steps/run-tests";

export const run = async () => {
  const command = getInput("command");

  info(`Running command: ${command}...`);

  switch (command) {
    case "run-tests":
      await runTests({
        coverage: getBooleanInput("coverage"),
        shard: getInput("shard"),
        skipArtifactUpload: getBooleanInput("skip-artifact-upload"),
      });
      break;
    case "merge-coverage":
      await mergeCoverage({
        token: getInput("github-token"),
        skipArtifactUpload: getBooleanInput("skip-artifact-upload"),
        shardCount: +getInput("shard-count"),
        showAllFilesInSummary: getBooleanInput("show-all-files-in-summary"),
      });
      break;
    default: {
      const _error = `Invalid command: ${command}`;
      error(_error);
      setFailed(_error);
    }
  }

  info(`Running command: ${command}... DONE`);
};
