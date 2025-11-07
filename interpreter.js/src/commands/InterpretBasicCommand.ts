import { type Command } from "@xieyuheng/commander.js"
import * as B from "../compiler/backend/index.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"

export const InterpretBasicCommand: Command = {
  name: "interpret-basic",
  description: "Interpret a basic-lisp file",
  help(commander) {
    let message = `The ${this.name} command interpret a basic-lisp file.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[interpret-basic] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      const mod = B.load(url)
      const context = B.createContext(mod)
      B.call(context, "main", [])
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
