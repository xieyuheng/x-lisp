import { type Command } from "@xieyuheng/commander.js"
import { errorReport } from "../helpers/error/errorReport.ts"

export const CompilePassesCommand: Command = {
  name: "compile-passes",
  description: "output all compiler passes for snapshot testing",
  help(commander) {
    let message = `The ${this.name} command compile a x-lisp file to see all the passes.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[compile-passes] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      // TODO
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
