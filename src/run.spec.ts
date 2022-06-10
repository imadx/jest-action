import * as mockedActionsCore from "@actions/core";
import { run } from "./run";

describe("run", () => {
  let spyOnError: jest.SpyInstance;
  let spyOnGetInput: jest.SpyInstance;
  let spyOnSetFailed: jest.SpyInstance;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    spyOnError = jest.spyOn(mockedActionsCore, "error").mockReturnValue();
    spyOnGetInput = jest.spyOn(mockedActionsCore, "getInput").mockReturnValue("gibberish");
    spyOnSetFailed = jest.spyOn(mockedActionsCore, "setFailed").mockReturnValue();
  });

  it("should route commands", () => {
    run();

    expect(spyOnGetInput).toHaveBeenCalledWith("command");
    expect(spyOnSetFailed).toHaveBeenCalledWith("Invalid command: gibberish");
    expect(spyOnError).toHaveBeenCalledWith("Invalid command: gibberish");
  });
});
