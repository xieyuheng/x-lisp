import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ClaimPass(pkg: M.Package): M.Outcome {
  let outcome: M.Outcome = "OutcomeOk"

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const [name, entry] of mod.claimed) {
        if (
          !mod.admitted.has(name) &&
          mod.definitions.get(name) === undefined
        ) {
          let message = `undefined claimed name`
          message += `\n  module: ${mod.name}`
          message += `\n  name: ${name}`

          if (entry.exp.location) {
            writeln(S.sourceLocationReport(entry.exp.location, message))
          } else {
            message += `\n  exp: ${M.formatTerm(entry.exp)}`
            writeln(message)
          }

          outcome = "OutcomeError"
        }
      }
    }
  }

  return outcome
}
