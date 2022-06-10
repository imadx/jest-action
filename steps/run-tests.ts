import { info } from "@actions/core";
import { execSync } from "child_process";
import { create as createClient } from "@actions/artifact";
import { getString, logException, moveFile } from "../utils";

interface RunTests {
  coverage: boolean;
  skipArtifactUpload: boolean;
  shard: string;
}

export const runTests = async ({ coverage, shard, skipArtifactUpload }: RunTests) => {
  info(getString("Running tests", coverage && "with coverage", shard && `for shard ${shard}`));

  try {
    const output = execSync(getString("npx --yes jest", coverage && "--coverage", shard && `--shard ${shard}`));

    info(output.toString());

    const coverageFileName = `coverage/coverage-shard-${shard.split("/")[0]}.json`;
    await moveFile("coverage/coverage-final.json", coverageFileName);

    if (!skipArtifactUpload) {
      info("Uploading artifacts...");
      const artifactClient = createClient();
      await artifactClient.uploadArtifact("coverage-shard", [coverageFileName], ".", {
        retentionDays: 1,
      });
      info("Uploading artifacts... DONE");
    }

    info("Running tests... DONE");
  } catch (exception) {
    logException(exception);
  }
};
