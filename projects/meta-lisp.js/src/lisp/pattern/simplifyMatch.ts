import { range } from "@xieyuheng/helpers.js/range"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import Path from "node:path"
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

  if (clauses.length === 0) {
    return defaultExp
  }

  if (targets.length === 0) {
    const [clause] = clauses
    assert(clause.patterns.length === 0)
    return clause.body
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
    return L.Cond(
      groups.map((group) => {
        const freshVars = group.dataConstructor.fields.map((field) =>
          L.createFreshVar(field.name, meta),
        )

        const definition = group.dataConstructor.definition

        const path = Path.relative(Path.dirname(mod.path), definition.mod.path)

        const dataConstructorPredicate =
          mod === definition.mod
            ? L.Var(`${group.dataConstructor.name}?`, meta)
            : L.Require(path, `${group.dataConstructor.name}?`, meta)

        const question = L.Apply(dataConstructorPredicate, [target])

        let answer = simplifyMatch(
          mod,
          [...freshVars, ...restTargets],
          group.clauses,
          defaultExp,
          meta,
        )

        for (const i of range(group.dataConstructor.fields.length)) {
          const field = group.dataConstructor.fields[i]

          const dataFieldGetter =
            mod === definition.mod
              ? L.Var(
                  `${group.dataConstructor.name}-${field.name}`,
                  answer.meta,
                )
              : L.Require(
                  path,
                  `${group.dataConstructor.name}-${field.name}`,
                  answer.meta,
                )

          answer = L.Let1(
            freshVars[i].name,
            L.Apply(dataFieldGetter, [target], answer.meta),
            answer,
            answer.meta,
          )
        }

        return L.CondClause(question, answer, meta)
      }),
      meta,
    )
  }

  const groups = groupClausesByHeadPatternKind(mod, clauses)
  return groups.reduceRight(
    (accumulatedExp, group) =>
      simplifyMatch(mod, targets, group, accumulatedExp, meta),
    defaultExp,
  )
}

function clauseHeadIsVarPattern(mod: L.Mod, clause: L.MatchClause): boolean {
  assert(clause.patterns.length > 0)
  return L.isVarPattern(mod, clause.patterns[0])
}

function clauseHeadIsDataPattern(mod: L.Mod, clause: L.MatchClause): boolean {
  assert(clause.patterns.length > 0)
  return L.isDataPattern(mod, clause.patterns[0])
}

type GroupByHeadDataConstructor = {
  dataConstructor: L.DataConstructor
  clauses: Array<L.MatchClause>
}

function formatGroupByHeadDataConstructor(
  group: GroupByHeadDataConstructor,
): string {
  const { dataConstructor, clauses } = group
  let s = `${dataConstructor.name}`
  for (const clause of clauses) {
    const patterns = L.formatExps(clause.patterns)
    const body = L.formatExp(clause.body)
    s += `\n  ${patterns} => ${body}`
  }

  return s
}

function groupClausesByHeadDataConstructor(
  mod: L.Mod,
  clauses: Array<L.MatchClause>,
): Array<GroupByHeadDataConstructor> {
  const definition = findDatatypeDefinitionFromClauses(mod, clauses)
  return definition.dataConstructors.map((dataConstructor) => {
    const groupedClauses: Array<L.MatchClause> = []
    for (const clause of clauses) {
      assert(clause.patterns.length > 0)
      const [pattern, ...restPatterns] = clause.patterns
      if (
        L.dataConstructorEqual(
          L.dataPatternDataConstructor(mod, pattern),
          dataConstructor,
        )
      ) {
        const argPatterns = L.dataPatternArgPatterns(mod, pattern)
        const newPatterns = [...argPatterns, ...restPatterns]
        const newClause = L.MatchClause(newPatterns, clause.body, clause.meta)
        groupedClauses.push(newClause)
      }
    }

    return { dataConstructor, clauses: groupedClauses }
  })
}

function findDatatypeDefinitionFromClauses(
  mod: L.Mod,
  clauses: Array<L.MatchClause>,
): L.DatatypeDefinition {
  let definition: L.DatatypeDefinition | undefined = undefined
  for (const clause of clauses) {
    assert(clause.patterns.length > 0)
    const [pattern, ...restPatterns] = clause.patterns
    const dataConstructor = L.dataPatternDataConstructor(mod, pattern)
    if (definition === undefined) {
      definition = dataConstructor.definition
    } else if (dataConstructor.definition !== definition) {
      let message = `[findDatatypeDefinitionFromClauses] datatype definition mismatch`
      message += `\n  definition name: ${definition.name}`
      if (clause.meta) throw new S.ErrorWithMeta(message, clause.meta)
      else throw new Error(message)
    }
  }

  assert(definition)
  return definition
}

function groupClausesByHeadPatternKind(
  mod: L.Mod,
  clauses: Array<L.MatchClause>,
): Array<Array<L.MatchClause>> {
  const groups: Array<Array<L.MatchClause>> = []
  for (const clause of clauses) {
    if (groups.length === 0) {
      groups.push([clause])
      continue
    }

    const group = groups[groups.length - 1]
    if (
      [clause, ...group].every((c) => clauseHeadIsVarPattern(mod, c)) ||
      [clause, ...group].every((c) => clauseHeadIsDataPattern(mod, c))
    ) {
      group.push(clause)
      continue
    } else {
      groups.push([clause])
      continue
    }
  }

  return groups
}
