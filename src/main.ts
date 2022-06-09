import * as core from '@actions/core'
import {wait} from './wait'
import jest from 'jest'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    core.setOutput('time', new Date().toTimeString())

    core.info('Running jest...')
    jest.run(['shard=1/2'])
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
