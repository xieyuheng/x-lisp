import { type Command } from "@xieyuheng/commander.js"
import { flags } from "../flags.ts"
import { load } from "../lang/load/index.ts"
import { errorReport } from "../utils/error/errorReport.ts"
import { createUrlOrFileUrl } from "../utils/url/createUrlOrFileUrl.ts"

export const DebugCommand: Command = {
  name: "debug",
  description: "Debug a file",
  help(commander) {
    let message = `The ${this.name} command run a file with debug flag.\n`
    message += `\n`
    message += `  ${commander.name} ${this.name} <file>\n`
    message += `\n`
    return message
  },

  async run(commander) {
    try {
      if (typeof commander.args[0] !== "string") {
        let message = `[debug] I expect the first argument to be a path\n`
        message += `  first argument: ${commander.args[0]}\n`
        throw new Error(message)
      }

      const url = createUrlOrFileUrl(commander.args[0])
      flags.debug = true
      load(url)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
