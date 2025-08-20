import { type Command } from "@xieyuheng/commander.js"
import { stdin, stdout } from "node:process"
import { createInterface } from "node:readline/promises"
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
      const rl = createInterface({
        input: stdin,
        output: stdout,
      })

      rl.on("line", (line) => {
        console.log(`Received: ${line}`)
      })
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
