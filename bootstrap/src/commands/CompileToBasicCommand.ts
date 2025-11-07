import { type Command } from "@xieyuheng/commander.js"
import * as B from "../basic/index.ts"
import { compileToBasic } from "../compile/index.ts"
import * as F from "../frontend/index.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"

export const CompileToBasicCommand: Command = {
  name: "compile-to-basic",
  description: "Compile x-lisp code to basic-lisp",
  help(commander) {
    let message = `The ${this.name} command compile a x-lisp file to basic-lisp.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[compile-to-basic] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      const mod = F.load(url)
      const basicMod = compileToBasic(mod)
      console.log(B.prettyMod(60, basicMod))
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
