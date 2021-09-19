const spawn = require('child_process').spawn

const command = {
  name: 'create-new-branch',
  description: 'Create a new branch from master.',
  alias: ['cnb'],
  hidden: false,
  run: async (toolbox) => {
    const {
      filesystem: { read, cwd },
      system: { run },
      print: { info, error, success },
      parameters,
      prompt: { ask },
    } = toolbox

    const onExit = () => {
      success('Task complete!')
      if (process.platform === 'win32') {
        run(`rundll32 user32.dll,MessageBeep -MB_ICONEXCLAMATION`)
      } else {
        console.log('\u0007')
      }
    }

    const branchName = (await (parameters.string === ''))
      ? ask({
          type: 'input',
          name: 'branchName',
          message: 'What is the name of the branch you want to create?',
        }).branchName
      : parameters.string

    const toMaster = await run(`git checkout master`)
    info(toMaster.stdout)
    if (toMaster.stderr) error(toMaster.stderr)
    const pullMaster = await run(`git pull`)
    info(pullMaster.stdout)
    if (pullMaster.stderr) error(pullMaster.stderr)
    const toBranch = await run(`git checkout -b ${branchName}`)

    process.on('exit', onExit)
  },
}

module.exports = command
