import { type Command } from "@xieyuheng/commander.js"
import { call, createContext } from "../compiler/backend/execute/index.ts"
import * as B from "../compiler/backend/index.ts"
import { load } from "../compiler/backend/load/index.ts"
import { compileToBasic } from "../compiler/compile/index.ts"
import * as F from "../compiler/frontend/index.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"

export const RunBasicCommand: Command = {
  name: "run-basic",
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
      let message = `[run-basic] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      const mod = load(url)
      const context = createContext(mod)
      call(context, "main", [])
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
      const mod = F.load(url)
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
