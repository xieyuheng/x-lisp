import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as L from "../index.ts"

export function simplifyMatch(
  mod: L.Mod,
  targets: Array<L.Exp>,
  clauses: Array<L.MatchClause>,
  defaultExp: L.Exp,
  meta?: S.TokenMeta,
): L.Exp {
  for (const clause of clauses) {
    if (clause.patterns.length !== targets.length) {
      let message = `[simplifyMatch] targets length mismatch`
      message += `\n  targets: ${L.formatExps(targets)}`
      message += `\n  patterns: ${L.formatExps(clause.patterns)}`
      throw new Error(message)
    }
  }

  if (targets.length === 0) {
    if (clauses.length === 0) {
      return defaultExp
    } else {
      const [clause] = clauses
      assert(clause.patterns.length === 0)
      return clause.body
    }
  }

  if (clauses.every((clause) => clauseHeadIsVarPattern(mod, clause))) {
    const [target, ...restTargets] = targets
    return simplifyMatch(
      mod,
      restTargets,
      clauses.map((clause) => {
        const [pattern, ...restPatterns] = clause.patterns
        assert(pattern.kind === "Var")
        return L.MatchClause(
          restPatterns,
          L.Let1(pattern.name, target, clause.body, clause.meta),
          clause.meta,
        )
      }),
      defaultExp,
      meta,
    )
  }

  if (clauses.every((clause) => clauseHeadIsDataPattern(mod, clause))) {
    const [target, ...restTargets] = targets
    return L.Match([target], meta)
  }

  throw new Error(`[simplifyMatch] unhandled case`)
}

function clauseHeadIsVarPattern(mod: L.Mod, clause: L.MatchClause): boolean {
  return clause.patterns.length > 0 && L.isVarPattern(mod, clause.patterns[0])
}

function clauseHeadIsDataPattern(mod: L.Mod, clause: L.MatchClause): boolean {
  return clause.patterns.length > 0 && L.isDataPattern(mod, clause.patterns[0])
}
