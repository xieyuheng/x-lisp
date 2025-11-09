import { type Command } from "@xieyuheng/commander.js"
import * as B from "../basic/index.ts"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"

export const BasicBundleCommand: Command = {
  name: "basic:bundle",
  description: "Bundle a basic-lisp file",
  help(commander) {
    let message = `The ${this.name} command bundle a basic-lisp file.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[basic:bundle] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      const dependencies = new Map()
      const mod = B.bundle(B.load(url, dependencies))
      console.log(B.prettyMod(60, mod))
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
