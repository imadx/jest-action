# Jest GitHub Action

This action allows Jest to be run in shards and reports merged coverage to the commit on behalf of the commit owner.

## Inputs

| Input                  | Required | Default        | Description                                                                       |
| ---------------------- | :------: | -------------- | --------------------------------------------------------------------------------- |
| `github-token`         |    ✓     | `GITHUB_TOKEN` | Github Token for the workflow                                                     |
| `command`              |          | `run-tests`    | Action to run. <br /> Available commands: `run-tests`, `merge-coverage`           |
| `coverage`             |          | `true`         | Enable Coverage for`run-tests` command                                            |
| `shard`                |          | `1/1`          | Jest shard to be executed for`run-tests` command (eg: `1/4`)                      |
| `skip-artifact-upload` |          | `false`        | Avoid uploading coverage results, if all the actions are running in a single step |

## Example with a matrix

> Note: if running multiple shards, `shard` (for `run-tests` command) and `shard-count` for `merge-coverage` command) need to be defined.

```yaml
name: Publish coverage result on Pull request

on:
  pull_request:
    branches:
      - master
jobs:
  run-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1/2, 2/2]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "16.x"
      - uses: imadx/jest-action@v0.3
        with:
          command: "run-tests"
          shard: ${{ matrix.shard }}

  merge-coverage:
    runs-on: ubuntu-latest
    needs: run-tests
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "16.x"
      - uses: imadx/jest-action@v0.3
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
          command: "merge-coverage"
          shard-count: "2"
```

## Example Usage for tests in this repo

The following is how the action is being used for this repo with `pnpm`

[.github/workflows/test.yml](https://github.com/imadx/jest-action/blob/main/.github/workflows/test.yml)
