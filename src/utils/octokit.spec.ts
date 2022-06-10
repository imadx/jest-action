import * as mockedActionsGithub from "@actions/github";

import { getOctokitForToken } from "./octokit";

describe("getOctokitForToken", () => {
  it("should expose getOctoKit", () => {
    const spyOnGetOctokit = jest.spyOn(mockedActionsGithub, "getOctokit").mockImplementation(jest.fn());
    getOctokitForToken("token");

    expect(spyOnGetOctokit).toHaveBeenCalledWith("token");
  });
});
