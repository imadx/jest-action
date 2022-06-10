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

## Example usage

```yaml
uses: actions/hello-world-javascript-action@v1.1
with:
  who-to-greet: "Mona the Octocat"
```

## Example with a matrix

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
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "16.x"
      - uses: imadx/jest-action@v0.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          command: "run-tests"
          shard: ${{ matrix.shard }}

  merge-coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "16.x"
      - uses: imadx/jest-action@v0.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          command: "merge-coverage"
```

## Example Usage for tests in this repo

The following is how the action is being used for this repo with `pnpm`

```yaml
name: "test"
on:
  pull_request:
  push:
    branches:
      - main
      - "releases/*"

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install NodeJS
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - uses: pnpm/action-setup@v2.0.1
        name: Install pnpm
        id: pnpm-install
        with:
          version: 7
          run_install: false

      - name: Get pnpm store directory
        id: pnpm-cache
        run: |
          echo "::set-output name=pnpm_cache_dir::$(pnpm store path)"

      - uses: actions/cache@v3
        name: Setup pnpm cache
        with:
          path: ${{ steps.pnpm-cache.outputs.pnpm_cache_dir }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install

      - uses: ./
        name: "Run tests 1/2"
        with:
          github-token: "${{ secrets.PERSONAL_ACCESS_TOKEN }}"
          command: "run-tests"
          shard: 1/2
          coverage: true

      - uses: ./
        name: "Run tests 2/2"
        with:
          github-token: "${{ secrets.PERSONAL_ACCESS_TOKEN }}"
          command: "run-tests"
          shard: 2/2
          coverage: true

      - uses: ./
        name: "Merge Coverage"
        with:
          github-token: "${{ secrets.PERSONAL_ACCESS_TOKEN }}"
          command: "merge-coverage"
```
