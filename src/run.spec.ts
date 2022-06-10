import * as mockedActionsCore from "@actions/core";
import { run } from "./run";

describe("run", () => {
  it("should route commands", () => {
    const spyOnError = jest.spyOn(mockedActionsCore, "error").mockReturnValue();
    const spyOnGetInput = jest.spyOn(mockedActionsCore, "getInput").mockReturnValue("gibberish");
    const spyOnSetFailed = jest.spyOn(mockedActionsCore, "setFailed").mockReturnValue();

    run();

    expect(spyOnGetInput).toHaveBeenCalledWith("command");
    expect(spyOnSetFailed).toHaveBeenCalledWith("Invalid command: gibberish");
    expect(spyOnError).toHaveBeenCalledWith("Invalid command: gibberish");
  });
});
