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
    const groups = groupClausesByHeadDataConstructor(mod, clauses)
    return L.Match(
      [target],
      groups.map((group) => {
        const freshVarPatterns = group.dataConstructor.fields.map(field => L.Var(field.name, meta))
        const newPattern = L.createDataPattern(mod, group.dataConstructor, freshVarPatterns)
        const newTargets = [...freshVarPatterns, ...restTargets]
        return L.MatchClause(
          [newPattern],
          simplifyMatch(mod, newTargets, group.clauses, defaultExp, meta),
          meta,
        )
      }),
      meta,
    )
  }

  throw new Error(`[simplifyMatch] unhandled case`)
}

function clauseHeadIsVarPattern(mod: L.Mod, clause: L.MatchClause): boolean {
  return clause.patterns.length > 0 && L.isVarPattern(mod, clause.patterns[0])
}

function clauseHeadIsDataPattern(mod: L.Mod, clause: L.MatchClause): boolean {
  return clause.patterns.length > 0 && L.isDataPattern(mod, clause.patterns[0])
}

type GroupByHeadDataConstructor = {
  dataConstructor: L.DataConstructor
  clauses: Array<L.MatchClause>
}

function groupClausesByHeadDataConstructor(
  mod: L.Mod,
  clauses: Array<L.MatchClause>,
): Array<GroupByHeadDataConstructor> {
  const groups: Array<GroupByHeadDataConstructor> = []
  for (const clause of clauses) {
    assert(clause.patterns.length > 0)
    const [pattern, ...restPatterns] = clause.patterns
    const dataConstructor = L.dataPatternDataConstructor(mod, pattern)
    const argPatterns = L.dataPatternArgPatterns(mod, pattern)
    const found = groups.find(
      (group) => group.dataConstructor.name === dataConstructor.name,
    )
    const newPatterns = [...argPatterns, ...restPatterns]
    const newClause = L.MatchClause(newPatterns, clause.body, clause.meta)
    if (found) {
      found.clauses.push(newClause)
    } else {
      groups.push({ dataConstructor, clauses: [newClause] })
    }
  }

  return groups
}
