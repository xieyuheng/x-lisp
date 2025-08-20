import { type Command } from "@xieyuheng/commander.js"
import { flags } from "../flags.ts"
import { load } from "../lang/load/index.ts"
import { errorReport } from "../utils/error/errorReport.ts"
import { createUrlOrFileUrl } from "../utils/url/createUrlOrFileUrl.ts"

export const DebugCommand: Command = {
  name: "debug",
  description: "Debug a file",
  help(commander) {
    return [
      `The ${this.name} command run a file with debug flag.`,
      ``,
      `  ${commander.name} ${this.name} <file>`,
      ``,
    ].join("\n")
  },

  async run(commander) {
    try {
      if (typeof commander.args[0] !== "string") {
        throw new Error(
          `[debug] I expect the first argument to be a path, instead of: ${commander.args[0]}`,
        )
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
