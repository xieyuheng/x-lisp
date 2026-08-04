import * as S from "@xieyuheng/sexp.js"
import { writeln } from "@xieyuheng/std.js/file"
import * as M from "../../meta/index.ts"

export function ClaimPass(pkg: M.Package): M.Outcome {
  const outcomes: Array<M.Outcome> = []

  for (const mod of pkg.mods.values()) {
    for (const [name, entry] of mod.claimed) {
      outcomes.push(setupClaimedType(mod, name, entry))
    }
  }

  return M.outcomeConj(outcomes)
}

function setupClaimedType(
  mod: M.Mod,
  name: string,
  entry: M.ClaimedEntry,
): M.Outcome {
  if (mod.admitted.has(name) || mod.definitions.get(name)) {
    const type = M.evaluateType(mod, M.emptyEnv("OpaqueMode"), entry.term)
    entry.type = type
    return "OutcomeOk"
  } else {
    let message = `undefined claimed name`
    message += `\n  module: ${mod.name}`
    message += `\n  name: ${name}`
    writeln(S.sourceLocationReport(entry.term.location, message))
    return "OutcomeError"
  }
}
