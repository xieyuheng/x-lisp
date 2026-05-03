import { range } from "@xieyuheng/helpers.js/range"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import Path from "node:path"
import * as M from "../index.ts"

export function simplifyMatch(
  mod: M.Mod,
  targets: Array<M.Exp>,
  clauses: Array<M.MatchClause>,
  defaultExp: M.Exp,
  location?: S.SourceLocation,
): M.Exp {
  for (const clause of clauses) {
    if (clause.patterns.length !== targets.length) {
      let message = `[simplifyMatch] targets length mismatch`
      message += `\n  targets: ${M.formatExps(targets)}`
      message += `\n  patterns: ${M.formatExps(clause.patterns)}`
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

  if (clauses.every(clauseHeadIsVarPattern)) {
    const [target, ...restTargets] = targets
    return simplifyMatch(
      mod,
      restTargets,
      clauses.map((clause) => {
        const [pattern, ...restPatterns] = clause.patterns
        assert(pattern.kind === "Var")
        return M.MatchClause(
          restPatterns,
          M.Let1(pattern.name, target, clause.body, clause.location),
          clause.location,
        )
      }),
      defaultExp,
      location,
    )
  }

  if (clauses.every(clauseHeadIsDataPattern)) {
    const [target, ...restTargets] = targets

    const groups = groupClausesByHeadDataConstructor(mod, clauses)
    return M.Cond(
      groups.map((group) => {
        const freshVars = group.dataConstructor.fields.map((field) =>
          M.createFreshVar(field.name, location),
        )

        const definition = group.dataConstructor.definition

        const path = Path.relative(Path.dirname(mod.name), definition.mod.name)

        const dataConstructorPredicateName = `${group.dataConstructor.name}?`
        const dataConstructorPredicate = M.modNameIsAsDefined(
          mod,
          dataConstructorPredicateName,
        )
          ? M.Var(dataConstructorPredicateName, location)
          : M.QualifiedVar(path, dataConstructorPredicateName, location)

        const question = M.Apply(dataConstructorPredicate, [target])

        let answer = simplifyMatch(
          mod,
          [...freshVars, ...restTargets],
          group.clauses,
          defaultExp,
          location,
        )

        for (const i of range(group.dataConstructor.fields.length)) {
          const field = group.dataConstructor.fields[i]

          const dataFieldGetterName = `${group.dataConstructor.name}-${field.name}`
          const dataFieldGetter = M.modNameIsAsDefined(mod, dataFieldGetterName)
            ? M.Var(dataFieldGetterName, answer.location)
            : M.QualifiedVar(path, dataFieldGetterName, answer.location)

          answer = M.Let1(
            freshVars[i].name,
            M.Apply(dataFieldGetter, [target], answer.location),
            answer,
            answer.location,
          )
        }

        return M.CondClause(question, answer, location)
      }),
      location,
    )
  }

  const groups = groupClausesByHeadPatternKind(mod, clauses)
  return groups.reduceRight(
    (accumulatedExp, group) =>
      simplifyMatch(mod, targets, group, accumulatedExp, location),
    defaultExp,
  )
}

function clauseHeadIsVarPattern(clause: M.MatchClause): boolean {
  assert(clause.patterns.length > 0)
  return M.isVarPattern(clause.patterns[0])
}

function clauseHeadIsDataPattern(clause: M.MatchClause): boolean {
  assert(clause.patterns.length > 0)
  return M.isDataPattern(clause.patterns[0])
}

type GroupByHeadDataConstructor = {
  dataConstructor: M.DataConstructor
  clauses: Array<M.MatchClause>
}

// - for debug

function formatGroupByHeadDataConstructor(
  group: GroupByHeadDataConstructor,
): string {
  const { dataConstructor, clauses } = group
  let s = `${dataConstructor.name}`
  for (const clause of clauses) {
    const patterns = M.formatExps(clause.patterns)
    const body = M.formatExp(clause.body)
    s += `\n  ${patterns} => ${body}`
  }

  return s
}

function groupClausesByHeadDataConstructor(
  mod: M.Mod,
  clauses: Array<M.MatchClause>,
): Array<GroupByHeadDataConstructor> {
  const definition = findDataDefinitionFromClauses(mod, clauses)
  return definition.dataConstructors.map((dataConstructor) => {
    const groupedClauses: Array<M.MatchClause> = []
    for (const clause of clauses) {
      assert(clause.patterns.length > 0)
      const [pattern, ...restPatterns] = clause.patterns
      if (
        M.dataConstructorEqual(
          M.dataPatternDataConstructor(mod, pattern),
          dataConstructor,
        )
      ) {
        const argPatterns = M.dataPatternArgPatterns(pattern)
        const newPatterns = [...argPatterns, ...restPatterns]
        const newClause = M.MatchClause(
          newPatterns,
          clause.body,
          clause.location,
        )
        groupedClauses.push(newClause)
      }
    }

    return { dataConstructor, clauses: groupedClauses }
  })
}

function findDataDefinitionFromClauses(
  mod: M.Mod,
  clauses: Array<M.MatchClause>,
): M.DataDefinition {
  let definition: M.DataDefinition | undefined = undefined
  for (const clause of clauses) {
    assert(clause.patterns.length > 0)
    const [pattern, ...restPatterns] = clause.patterns
    const dataConstructor = M.dataPatternDataConstructor(mod, pattern)
    if (definition === undefined) {
      definition = dataConstructor.definition
    } else if (dataConstructor.definition !== definition) {
      let message = `[findDataDefinitionFromClauses] datatype definition mismatch`
      message += `\n  definition name: ${definition.name}`
      if (clause.location)
        throw new S.ErrorWithSourceLocation(message, clause.location)
      else throw new Error(message)
    }
  }

  assert(definition)
  return definition
}

function groupClausesByHeadPatternKind(
  mod: M.Mod,
  clauses: Array<M.MatchClause>,
): Array<Array<M.MatchClause>> {
  const groups: Array<Array<M.MatchClause>> = []
  for (const clause of clauses) {
    if (groups.length === 0) {
      groups.push([clause])
      continue
    }

    const group = groups[groups.length - 1]
    if (
      [clause, ...group].every(clauseHeadIsVarPattern) ||
      [clause, ...group].every(clauseHeadIsDataPattern)
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
