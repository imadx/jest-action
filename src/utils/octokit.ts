import { getOctokit } from "@actions/github";

export const getOctokitForToken = (token: string) => {
  return getOctokit(token);
};
