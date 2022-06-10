export interface ExecError {
  stdout: Buffer | string;
}

export interface CoverageMetric {
  lines: CoverageMetricDetails;
  statements: CoverageMetricDetails;
  functions: CoverageMetricDetails;
  branches: CoverageMetricDetails;
}

export interface CoverageMetricDetails {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

export interface CoverageSummary {
  total: CoverageMetric;
  [filename: string]: CoverageMetric;
}
