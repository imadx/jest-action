export const coverageSummary = {
  total: {
    lines: {
      total: 117,
      covered: 58,
      skipped: 0,
      pct: 49.57,
    },
    statements: {
      total: 135,
      covered: 73,
      skipped: 0,
      pct: 54.07,
    },
    functions: {
      total: 18,
      covered: 12,
      skipped: 0,
      pct: 66.66,
    },
    branches: {
      total: 27,
      covered: 9,
      skipped: 0,
      pct: 33.33,
    },
    branchesTrue: {
      total: 0,
      covered: 0,
      skipped: 0,
      pct: 100,
    },
  },
  "/imadx/jest-actions/index.ts": {
    lines: {
      total: 15,
      covered: 0,
      skipped: 0,
      pct: 0,
    },
    functions: {
      total: 1,
      covered: 0,
      skipped: 0,
      pct: 0,
    },
    statements: {
      total: 15,
      covered: 0,
      skipped: 0,
      pct: 0,
    },
    branches: {
      total: 3,
      covered: 0,
      skipped: 0,
      pct: 0,
    },
  },
  "/imadx/jest-actions/src/run.ts": {
    lines: {
      total: 16,
      covered: 12,
      skipped: 0,
      pct: 75,
    },
    functions: {
      total: 2,
      covered: 2,
      skipped: 0,
      pct: 100,
    },
    statements: {
      total: 18,
      covered: 14,
      skipped: 0,
      pct: 77.77,
    },
    branches: {
      total: 3,
      covered: 1,
      skipped: 0,
      pct: 33.33,
    },
  },
  "/imadx/jest-actions/src/steps/merge-coverage.ts": {
    lines: {
      total: 32,
      covered: 9,
      skipped: 0,
      pct: 28.12,
    },
    functions: {
      total: 3,
      covered: 0,
      skipped: 0,
      pct: 0,
    },
    statements: {
      total: 36,
      covered: 11,
      skipped: 0,
      pct: 30.55,
    },
    branches: {
      total: 4,
      covered: 0,
      skipped: 0,
      pct: 0,
    },
  },
  "/imadx/jest-actions/src/steps/run-tests.ts": {
    lines: {
      total: 23,
      covered: 6,
      skipped: 0,
      pct: 26.08,
    },
    functions: {
      total: 2,
      covered: 0,
      skipped: 0,
      pct: 0,
    },
    statements: {
      total: 25,
      covered: 7,
      skipped: 0,
      pct: 28,
    },
    branches: {
      total: 9,
      covered: 0,
      skipped: 0,
      pct: 0,
    },
  },
  "/imadx/jest-actions/src/utils/index.ts": {
    lines: {
      total: 31,
      covered: 31,
      skipped: 0,
      pct: 100,
    },
    functions: {
      total: 10,
      covered: 10,
      skipped: 0,
      pct: 100,
    },
    statements: {
      total: 41,
      covered: 41,
      skipped: 0,
      pct: 100,
    },
    branches: {
      total: 8,
      covered: 8,
      skipped: 0,
      pct: 100,
    },
  },
};

export const execSyncOutput = `--------------------|---------|----------|---------|---------|------------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s      
--------------------|---------|----------|---------|---------|------------------------
All files           |   25.51 |    18.51 |   16.66 |   21.25 |                        
 src                |       0 |        0 |       0 |       0 |                        
  index.ts          |       0 |        0 |       0 |       0 | 1-34                   
  run3.ts           |       0 |        0 |       0 |       0 | 1-33                   
 src/steps          |   23.94 |        0 |      40 |   21.53 |                        
  merge-coverage.ts |   36.95 |        0 |   66.66 |   33.33 | 21-24,33-60,67-85      
  run-tests.ts      |       0 |        0 |       0 |       0 | 1-42                   
 src/utils          |   48.78 |     62.5 |      10 |   41.93 |                        
  index.ts          |   48.78 |     62.5 |      10 |   41.93 | 7,11,21-36,40-43,47,51 
--------------------|---------|----------|---------|---------|------------------------
`;
