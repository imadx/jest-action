import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const ms = core.getInput("milliseconds");
    console.log(`Waiting ${ms} milliseconds ...`);

    await new Promise((resolve) => setTimeout(resolve, Number(ms)));

    const greeter = core.getInput("who-to-greet");
    console.log(`Hello ${greeter}`);

    core.setOutput("time", new Date().toTimeString());

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (exception) {
    console.error(exception);
    core.setFailed(exception.message);
  }
}
