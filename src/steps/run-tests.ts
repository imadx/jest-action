import { info, setOutput } from "@actions/core";
import { execSync } from "child_process";
import { create as createClient } from "@actions/artifact";
import { getCoverageArtifactName, getCoverageFileName, getString, logException, moveFile } from "../utils";
import { debug } from "@actions/core";

interface RunTests {
  coverage: boolean;
  skipArtifactUpload: boolean;
  shard: string;
}

export const runTests = async ({ coverage, shard, skipArtifactUpload }: RunTests) => {
  info(getString("Running tests", coverage && "with coverage", shard && `for shard ${shard}`));

  try {
    const output = execSync(getString("npm run test --", coverage && "--coverage", shard && `--shard ${shard}`));

    info(output.toString());

    const shardIndex = +shard.split("/")[0];
    debug(`shardIndex: ${shardIndex}`);

    const coverageFileName = getCoverageFileName(shardIndex);
    debug(`coverageFileName: ${coverageFileName}`);
    await moveFile("coverage/coverage-final.json", coverageFileName);

    if (skipArtifactUpload) {
      info("Running tests... DONE");
      return;
    }
    info("Uploading artifacts...");
    const artifactClient = createClient();
    const outputUploadArtifact = await artifactClient.uploadArtifact(
      getCoverageArtifactName(shardIndex),
      [coverageFileName],
      ".",
      {
        retentionDays: 1,
      }
    );

    debug(`outputUploadArtifact: ${JSON.stringify(outputUploadArtifact)}`);

    info("Uploading artifacts... DONE");

    info("Running tests... DONE");
  } catch (exception) {
    logException(exception);
  }
};
