import * as S from "@xieyuheng/sexp.js"
import { writeln } from "@xieyuheng/std.js/file"
import * as M from "../index.ts"

export function ClaimPass(pkg: M.Package): M.Outcome {
  let outcome: M.Outcome = "OutcomeOk"

  for (const mod of pkg.mods.values()) {
    for (const [name, entry] of mod.claimed) {
      if (!mod.admitted.has(name) && mod.definitions.get(name) === undefined) {
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

      const type = M.evaluateType(mod, M.emptyEnv("OpaqueMode"), entry.exp)
      entry.type = type
    }
  }

  return outcome
}
