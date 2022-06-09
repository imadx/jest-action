export interface ExecError {
  stdout: Buffer | string;
}

export interface SummaryTotal {
  lines: SummaryTotalStats;
  statements: SummaryTotalStats;
  functions: SummaryTotalStats;
  branches: SummaryTotalStats;
}

export interface SummaryTotalStats {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}
