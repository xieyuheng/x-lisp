import { type Command } from "@xieyuheng/commander.js"
import { errorReport } from "../utils/error/errorReport.ts"
import { createUrlOrFileUrl } from "../utils/url/createUrlOrFileUrl.ts"

export const FormatCommand: Command = {
  name: "format",
  description: "Format a file",
  help(commander) {
    let message = `The ${this.name} command format a file.\n`
    message += `\n`
    message += `  ${commander.name} ${this.name} <file>\n`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[format] expect the first argument to be a path\n`
      message += `  first argument: ${commander.args[0]}\n`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      console.log(url)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
