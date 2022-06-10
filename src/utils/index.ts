import { error, setFailed } from "@actions/core";
import { mv } from "@actions/io";
import { ExecError, CoverageMetric, CoverageSummary } from "../types";
import { capitalize } from "lodash";

export const getString = (...args: (number | string | null | undefined)[]): string => {
  return args.filter(Boolean).join(" ");
};

export const moveFile = async (source: string, destination: string) => {
  await mv(source, destination, { force: true });
};

export const logException = (exception: Error | ExecError) => {
  const message = (exception as ExecError).stdout?.toString() || (exception as Error).message;
  error(message);
  setFailed(message);
};

export const getSummaryTable = (summaryTotal: CoverageMetric): string => {
  const getHeader = () => {
    return [`| | Covered/Total | Percentage |`, `|:--| :--: | --:|`];
  };

  const getLine = (metric: keyof CoverageMetric) => {
    const { covered, total, pct } = summaryTotal[metric];
    return `| <b>${capitalize(metric)}</b> | \`${covered}/${total}\` | \`${pct}%\` ${getIndicator(pct)} |`;
  };

  const output = [...getHeader()];
  output.push(getLine("statements"));
  output.push(getLine("branches"));
  output.push(getLine("functions"));
  output.push(getLine("lines"));

  return output.join("\n");
};

export const getIndicator = (progress: number): string => {
  if (progress > 80) return "🟢";
  if (progress > 60) return "🟠";

  return "🔴";
};

export const getCoverageFileName = (shardIndex: number) => {
  return `coverage/coverage-shard-${shardIndex}.json`;
};

export const getCoverageArtifactName = (shardIndex: number) => {
  return `coverage-shard-${shardIndex}`;
};
