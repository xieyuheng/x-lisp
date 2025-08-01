import { type Command } from "@xieyuheng/commander.js"
import { load } from "../lang/load/index.ts"
import { errorReport } from "../utils/error/errorReport.ts"
import { createUrlOrFileUrl } from "../utils/url/createUrlOrFileUrl.ts"

export const RunCommand: Command = {
  name: "run",
  description: "Run a file",
  help(commander) {
    return [
      `The ${this.name} command run a file.`,
      ``,
      `  ${commander.name} ${this.name} <file>`,
      ``,
    ].join("\n")
  },

  async run(commander) {
    try {
      if (typeof commander.args[0] !== "string") {
        throw new Error(
          `[run] I expect the first argument to be a path, instead of: ${commander.args[0]}`,
        )
      }

      const url = createUrlOrFileUrl(commander.args[0])
      await load(url)
    } catch (error) {
      errorReport(error)
      process.exit(1)
    }
  },
}
