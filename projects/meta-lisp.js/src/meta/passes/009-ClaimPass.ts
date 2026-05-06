import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ClaimPass(project: M.Project): void {
  for (const mod of project.mods.values()) {
    for (const [name, entry] of mod.claimed) {
      if (!mod.admitted.has(name) && mod.definitions.get(name) === undefined) {
        let message = `undefined claimed name`
        message += `\n  module: ${mod.name}`
        message += `\n  name: ${name}`

        if (entry.exp.location) {
          writeln(S.sourceLocationReport(entry.exp.location, message))
        } else {
          message += `\n  exp: ${M.formatExp(entry.exp)}`
          writeln(message)
        }
      }
    }
  }
}
