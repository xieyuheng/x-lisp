import { type Command } from "@xieyuheng/commander.js"
import { errorReport } from "../helpers/error/errorReport.ts"
import { loadProject } from "../project/index.ts"

export const BuildCommand: Command = {
  name: "build",
  description: "Build a x-lisp project",
  help(commander) {
    let message = `The ${this.name} command build a x-lisp project.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[${this.name}] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const path = commander.args[0]
      const ProjectConfig = await loadProject(path)
      console.log(ProjectConfig)
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}
