import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ClaimPass(project: M.Project): void {
  M.projectForEachMod(project, (mod) => {
    for (const [name, entry] of mod.claimed) {
      if (!mod.exempted.has(name) && mod.definitions.get(name) === undefined) {
        let message = `undefined claimed name`
        message += `\n  name: ${mod.name}/${name}`

        if (entry.exp.location) {
          writeln(S.sourceLocationReport(entry.exp.location, message))
        } else {
          message += `\n  exp: ${M.formatExp(entry.exp)}`
          writeln(message)
        }
      }
    }

    M.modForEachClaimEntry(mod, (entry) => {
      entry.exp = M.desugar(M.createDesugarState(mod), entry.exp)
      entry.exp = M.qualifyFreeVar(mod, new Set(), entry.exp)
    })
  })
}
