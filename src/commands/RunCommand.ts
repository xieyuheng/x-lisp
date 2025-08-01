import { type Command } from "@xieyuheng/commander.js"
import { load } from "../lang/load/index.ts"
import { createFileUrl } from "../utils/url/createFileUrl.ts"
import { isValidUrl } from "../utils/url/isValidUrl.ts"

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

      const path = commander.args[0]
      const url = isValidUrl(path) ? new URL(path) : createFileUrl(path)
      await load(url)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        process.exit(1)
      }

      console.log("unknown error", { error })
      process.exit(1)
    }
  },
}
