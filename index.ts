import { error, getBooleanInput, getInput, setFailed } from "@actions/core";
import { info } from "console";
import { mergeCoverage } from "./steps/merge-coverage";
import { runTests } from "./steps/run-tests";

async function run() {
  const command = getInput("command");

  info(`Running command: ${command}...`);

  switch (command) {
    case "run-tests":
      const coverage = getBooleanInput("coverage");
      const shard = getInput("shard");

      await runTests({ coverage, shard });
      break;
    case "merge-coverage":
      await mergeCoverage({
        token: getInput("github-token"),
      });
      break;
    default:
      error(`Invalid command: ${command}`);
      setFailed(`Invalid command: ${command}`);
  }

  info(`Running command: ${command}... DONE`);
}

run();
