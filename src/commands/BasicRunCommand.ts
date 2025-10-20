import { type Command } from "@xieyuheng/commander.js"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"

export const BasicRunCommand: Command = {
  name: "basic:run",
  description: "Run a basic-lisp file",
  help(commander) {
    let message = `The ${this.name} command run a basic-lisp file.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[basic:run] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      // load(url)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
