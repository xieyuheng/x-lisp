import { type Command } from "@xieyuheng/commander.js"
import { flags } from "../flags.ts"
import { globals } from "../globals.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"
import { load } from "../interpreter/load/index.ts"

export const RunCommand: Command = {
  name: "run",
  description: "Run a x-lisp file",
  help(commander) {
    let message = `The ${this.name} command run a x-lisp file.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    globals.commandLineArgs = commander.args.map(String).slice(1)

    if (commander.options["debug"]) {
      flags["debug"] = true
    }

    if (commander.options["no-prelude"]) {
      flags["no-prelude"] = true
    }

    if (typeof commander.args[0] !== "string") {
      let message = `[run] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      load(url)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
