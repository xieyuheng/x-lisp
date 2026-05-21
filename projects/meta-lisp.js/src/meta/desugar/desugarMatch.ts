import { range } from "@xieyuheng/helpers.js/range"
import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as M from "../index.ts"

export function desugarMatch(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicInfo: M.AlgebraicInfo,
  targets: Array<M.Exp>,
  clauses: Array<M.MatchClause>,
  defaultExp: M.Exp,
  location: S.SourceLocation,
): M.Exp {
  for (const clause of clauses) {
    if (clause.patterns.length !== targets.length) {
      let message = `[desugarMatch] targets length mismatch`
      message += `\n  targets: ${M.formatExps(targets)}`
      message += `\n  patterns: ${M.formatExps(clause.patterns)}`
      throw new S.ErrorWithSourceLocation(message, location)
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
    return desugarMatch(
      scope,
      currentModName,
      algebraicInfo,
      restTargets,
      clauses.map((clause) => {
        const [pattern, ...restPatterns] = clause.patterns
        assert(pattern.kind === "VarExp")
        return M.MatchClause(
          restPatterns,
          M.Let1Exp(pattern.name, target, clause.body, clause.location),
          clause.location,
        )
      }),
      defaultExp,
      location,
    )
  }

  if (clauses.every(clauseHeadIsDataPattern)) {
    const [target, ...restTargets] = targets

    const groups = groupClausesByHeadDataConstructor(
      scope,
      currentModName,
      algebraicInfo,
      clauses,
    )
    return M.CondExp(
      groups.map((group) => {
        const usedNames = setUnionMany([
          M.expOccurredNames(defaultExp),
          ...targets.map((t) => M.expOccurredNames(t)),
          ...group.clauses.map((c) =>
            setUnionMany([
              ...c.patterns.map(M.expOccurredNames),
              M.expOccurredNames(c.body),
            ]),
          ),
        ])
        const freshVars = group.dataConstructorInfo.fieldNames.map(
          (fieldName) =>
            M.VarExp(
              M.generateRelativeFreshName(fieldName, usedNames),
              location,
            ),
        )

        const predicate = M.QualifiedVarExp(
          group.dataConstructorInfo.modName,
          group.dataConstructorInfo.predicateName,
          location,
        )
        const question = M.ApplyExp(predicate, [target], target.location)

        let answer = desugarMatch(
          scope,
          currentModName,
          algebraicInfo,
          [...freshVars, ...restTargets],
          group.clauses,
          defaultExp,
          location,
        )

        for (const i of range(group.dataConstructorInfo.fieldNames.length)) {
          const accessorName = group.dataConstructorInfo.accessorNames[i]
          const accessor = M.QualifiedVarExp(
            group.dataConstructorInfo.modName,
            accessorName,
            answer.location,
          )
          answer = M.Let1Exp(
            freshVars[i].name,
            M.ApplyExp(accessor, [target], answer.location),
            answer,
            answer.location,
          )
        }

        return M.CondClause(question, answer, location)
      }),
      location,
    )
  }

  const groups = groupClausesByHeadPatternKind(clauses)
  return groups.reduceRight(
    (accumulatedExp, group) =>
      desugarMatch(
        scope,
        currentModName,
        algebraicInfo,
        targets,
        group,
        accumulatedExp,
        location,
      ),
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
  dataConstructorInfo: M.DataConstructorInfo
  clauses: Array<M.MatchClause>
}

function resolveDataConstructorQualifiedName(
  scope: M.FragmentScope,
  currentModName: string,
  pattern: M.Exp,
): { modName: string; name: string } {
  assert(M.isDataPattern(pattern))
  assert(pattern.kind === "ApplyExp")

  const target = pattern.target

  if (target.kind === "QualifiedVarExp") {
    return { modName: target.modName, name: target.name }
  }

  if (target.kind === "VarExp") {
    const entry = scope.importedNames.get(target.name)
    if (entry) {
      return { modName: entry.modName, name: entry.name }
    } else {
      return { modName: currentModName, name: target.name }
    }
  }

  let message =
    "[resolveDataConstructorQualifiedName] unhandled pattern target kind"
  throw new S.ErrorWithSourceLocation(message, pattern.location)
}

function resolveDataConstructor(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicInfo: M.AlgebraicInfo,
  pattern: M.Exp,
): M.DataConstructorInfo {
  const { modName, name } = resolveDataConstructorQualifiedName(
    scope,
    currentModName,
    pattern,
  )

  const info = algebraicInfo.dataConstructorInfos.get(`${modName}/${name}`)
  if (!info) {
    let message = `[resolveDataConstructor] undefined data constructor`
    message += `\n  modName: ${modName}`
    message += `\n  name: ${name}`
    throw new S.ErrorWithSourceLocation(message, pattern.location)
  }

  return info
}

function groupClausesByHeadDataConstructor(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicInfo: M.AlgebraicInfo,
  clauses: Array<M.MatchClause>,
): Array<GroupByHeadDataConstructor> {
  const typeInfo = findAlgebraicTypeInfoFromClauses(
    scope,
    currentModName,
    algebraicInfo,
    clauses,
  )
  return typeInfo.constructorNames.map((ctorName) => {
    const key = `${typeInfo.modName}/${ctorName}`
    const info = algebraicInfo.dataConstructorInfos.get(key)
    assert(info)

    const groupedClauses: Array<M.MatchClause> = []
    for (const clause of clauses) {
      assert(clause.patterns.length > 0)
      const [pattern, ...restPatterns] = clause.patterns
      const resolved = resolveDataConstructor(
        scope,
        currentModName,
        algebraicInfo,
        pattern,
      )
      if (
        resolved.modName === info.modName &&
        resolved.typeName === info.typeName &&
        resolved.name === info.name
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

    return { dataConstructorInfo: info, clauses: groupedClauses }
  })
}

function findAlgebraicTypeInfoFromClauses(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicInfo: M.AlgebraicInfo,
  clauses: Array<M.MatchClause>,
): M.AlgebraicTypeInfo {
  let typeInfo: M.AlgebraicTypeInfo | undefined = undefined
  for (const clause of clauses) {
    assert(clause.patterns.length > 0)
    const [pattern] = clause.patterns
    const info = resolveDataConstructor(
      scope,
      currentModName,
      algebraicInfo,
      pattern,
    )
    const key = `${info.modName}/${info.typeName}`
    const currentTypeInfo = algebraicInfo.algebraicTypeInfos.get(key)
    if (!currentTypeInfo) {
      let message = `[findAlgebraicTypeInfoFromClauses] cannot find algebraic type info`
      message += `\n  constructor name: ${info.name}`
      message += `\n  type name: ${info.typeName}`
      message += `\n  module name: ${info.modName}`
      throw new S.ErrorWithSourceLocation(message, clause.location)
    }

    if (!typeInfo) {
      typeInfo = currentTypeInfo
    } else if (
      currentTypeInfo.modName !== typeInfo.modName ||
      currentTypeInfo.name !== typeInfo.name
    ) {
      let message = `[findAlgebraicTypeInfoFromClauses] datatype definition mismatch`
      message += `\n  definition name: ${typeInfo.name}`
      throw new S.ErrorWithSourceLocation(message, clause.location)
    }
  }

  assert(typeInfo)
  return typeInfo
}

function groupClausesByHeadPatternKind(
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

export function makeDefaultExp(
  targets: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("builtin", "error", location),
    [
      M.ApplyExp(
        M.QualifiedVarExp("builtin", "format", location),
        [
          M.ListExp(
            [
              M.StringExp("match mismatch", location),
              M.ListExp(targets, location),
            ],
            location,
          ),
        ],
        location,
      ),
    ],
    location,
  )
}
