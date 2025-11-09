import { type Command } from "@xieyuheng/commander.js"
import * as B from "../basic/index.ts"
import { compileToBasic } from "../compile/index.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"
import * as L from "../lang/index.ts"

export const RunBasicCommand: Command = {
  name: "basic:run",
  description: "Run a basic-lisp file",
  help(commander) {
    let message = `The ${this.name} command run a basic-lisp file.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[basic:run] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      const dependencies = new Map()
      const mod = B.load(url, dependencies)
      const context = B.createContext(mod)
      B.call(context, "main", [])
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}

export const RunViaBasicCommand: Command = {
  name: "run-via-basic",
  description: "Run x-lisp code via basic-lisp",
  help(commander) {
    let message = `The ${this.name} command run a x-lisp file via basic-lisp.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[compile-via-basic] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      const mod = L.load(url)
      const basicMod = compileToBasic(mod)
      const context = B.createContext(basicMod)
      B.call(context, "main", [])
    } catch (error) {
      console.log(error)
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
