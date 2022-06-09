import { info } from "@actions/core";
import { execSync } from "child_process";
import { getString, logException, moveFile } from "../utils";

interface RunTests {
  coverage: boolean;
  shard?: string;
}

export const runTests = async ({ coverage, shard }: RunTests) => {
  info(
    getString(
      "Running tests",
      coverage && "with coverage",
      shard && `for shard ${shard}`,
    ),
  );

  try {
    const output = execSync(
      getString(
        "npx --yes jest",
        coverage && "--coverage",
        shard && `--shard ${shard}`,
      ),
    );

    info(output.toString());

    moveFile(
      "coverage/coverage-final.json",
      `coverage/coverage-shard-${shard.split("/")[0]}.json`,
    );

    info("Running tests... DONE");
  } catch (exception) {
    logException(exception);
  }
};
