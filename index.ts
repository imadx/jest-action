import { error, getBooleanInput, getInput, setFailed } from "@actions/core";
import { info } from "console";
import { mergeCoverage } from "./steps/merge-coverage";
import { runTests } from "./steps/run-tests";

async function run() {
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
      });
      break;
    default:
      error(`Invalid command: ${command}`);
      setFailed(`Invalid command: ${command}`);
  }

  info(`Running command: ${command}... DONE`);
}

run();
