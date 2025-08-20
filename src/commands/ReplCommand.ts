import { type Command } from "@xieyuheng/commander.js"
import { errorReport } from "../utils/error/errorReport.ts"

export const ReplCommand: Command = {
  name: "repl",
  description: "Start the REPL",
  help(commander) {
    let message = `The ${this.name} start the read-eval-print loop.\n`
    return message
  },

  async run(commander) {
    try {
      console.log("repl")
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
