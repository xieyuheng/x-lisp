import { type Command } from "@xieyuheng/commander.js"
import { compilePasses } from "../compile/index.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"
import * as L from "../lang/index.ts"

export const CompilePassesCommand: Command = {
  name: "compile-passes",
  description: "Output all compiler passes for snapshot testing",
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
      const url = createUrlOrFileUrl(commander.args[0])
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      compilePasses(mod)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
