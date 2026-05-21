import { range } from "@xieyuheng/helpers.js/range"
import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as M from "../index.ts"

export type DesugarMatchCtx = {
  scope: M.FragmentScope
  currentModName: string
  algebraicInfo: M.AlgebraicInfo
}

export function makeDesugarMatchCtx(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicInfo: M.AlgebraicInfo,
): DesugarMatchCtx {
  return { scope, currentModName, algebraicInfo }
}

export function desugarMatch(
  ctx: DesugarMatchCtx,
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
      ctx,
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
    const groups = groupClausesByHeadDataConstructor(ctx, clauses)
    return M.CondExp(
      groups.map((group) => {
        const [target, ...restTargets] = targets
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
          ctx,
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
      desugarMatch(ctx, targets, group, accumulatedExp, location),
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


function groupClausesByHeadDataConstructor(
  ctx: DesugarMatchCtx,
  clauses: Array<M.MatchClause>,
): Array<GroupByHeadDataConstructor> {
  const map = new Map<string, GroupByHeadDataConstructor>()
  let typeKey: string | undefined

  for (const clause of clauses) {
    assert(clause.patterns.length > 0)
    const [pattern, ...restPatterns] = clause.patterns

    const { modName, name } = resolveDataConstructorQualifiedName(ctx, pattern)
    const key = `${modName}/${name}`
    const info = ctx.algebraicInfo.dataConstructorInfos.get(key)
    if (!info) {
      let message = `[groupClausesByHeadDataConstructor] undefined data constructor`
      message += `\n  modName: ${modName}`
      message += `\n  name: ${name}`
      throw new S.ErrorWithSourceLocation(message, clause.location)
    }

    const currentTypeKey = `${info.modName}/${info.typeName}`
    if (!typeKey) {
      typeKey = currentTypeKey
    } else if (currentTypeKey !== typeKey) {
      let message = `[groupClausesByHeadDataConstructor] datatype definition mismatch`
      message += `\n  current type: ${currentTypeKey}`
      message += `\n  expected type: ${typeKey}`
      throw new S.ErrorWithSourceLocation(message, clause.location)
    }

    let entry = map.get(key)
    if (!entry) {
      entry = { dataConstructorInfo: info, clauses: [] }
      map.set(key, entry)
    }
    const argPatterns = M.dataPatternArgPatterns(pattern)
    entry.clauses.push(
      M.MatchClause(
        [...argPatterns, ...restPatterns],
        clause.body,
        clause.location,
      ),
    )
  }

  assert(typeKey)
  const typeInfo = ctx.algebraicInfo.algebraicTypeInfos.get(typeKey)
  assert(typeInfo)

  return typeInfo.constructorNames.map((ctorName) => {
    const key = `${typeInfo.modName}/${ctorName}`
    return (
      map.get(key) ?? {
        dataConstructorInfo: ctx.algebraicInfo.dataConstructorInfos.get(key)!,
        clauses: [],
      }
    )
  })
}


function resolveDataConstructorQualifiedName(
  ctx: DesugarMatchCtx,
  pattern: M.Exp,
): { modName: string; name: string } {
  assert(M.isDataPattern(pattern))
  assert(pattern.kind === "ApplyExp")

  const target = pattern.target

  if (target.kind === "QualifiedVarExp") {
    return { modName: target.modName, name: target.name }
  }

  if (target.kind === "VarExp") {
    const entry = ctx.scope.importedNames.get(target.name)
    if (entry) {
      return { modName: entry.modName, name: entry.name }
    } else {
      return { modName: ctx.currentModName, name: target.name }
    }
  }

  let message =
    "[resolveDataConstructorQualifiedName] unhandled pattern target kind"
  throw new S.ErrorWithSourceLocation(message, pattern.location)
}

function groupClausesByHeadPatternKind(
  clauses: Array<M.MatchClause>,
): Array<Array<M.MatchClause>> {
  const groups: Array<Array<M.MatchClause>> = []
  for (const clause of clauses) {
    const last = groups.at(-1)
    if (last && samePatternKind(clause, last[0])) {
      last.push(clause)
    } else {
      groups.push([clause])
    }
  }
  return groups
}

function samePatternKind(a: M.MatchClause, b: M.MatchClause): boolean {
  return clauseHeadIsVarPattern(a) === clauseHeadIsVarPattern(b)
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
