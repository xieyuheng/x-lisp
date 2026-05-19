import { range } from "@xieyuheng/helpers.js/range"
import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import Path from "node:path"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"
import { createDesugarState, desugar } from "./020-DesugarPass.ts"

export function LowerMatchPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      lowerMatchDefinition(mod, definition)
    }
  }

  if (options.dump) projectDumpMods(project, "015-lower-match")
}

function lowerMatchDefinition(mod: M.Mod, definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      definition.body = lowerMatch(mod, definition.body)
      return null
    }

    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return null
    }
  }
}

function lowerMatch(mod: M.Mod, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Match": {
      const state = createDesugarState()

      const defaultExp = M.Apply(
        M.QualifiedVar("builtin", "error", exp.location),
        [
          M.LiteralList(
            [
              M.String("match mismatch", exp.location),
              M.LiteralList(exp.targets, exp.location),
            ],
            exp.location,
          ),
        ],
        exp.location,
      )

      return desugar(
        state,
        simplifyMatch(
          mod,
          exp.targets.map((t) => lowerMatch(mod, t)),
          exp.clauses.map((clause) => ({
            ...clause,
            body: lowerMatch(mod, clause.body),
          })),
          defaultExp,
          exp.location,
        ),
      )
    }

    default: {
      return M.expTraverse((child) => lowerMatch(mod, child), exp)
    }
  }
}

function simplifyMatch(
  mod: M.Mod,
  targets: Array<M.Exp>,
  clauses: Array<M.MatchClause>,
  defaultExp: M.Exp,
  location: S.SourceLocation,
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
        const freshVars = group.dataConstructor.fields.map((field) =>
          M.Var(M.generateRelativeFreshName(field.name, usedNames), location),
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

        const question = M.Apply(
          dataConstructorPredicate,
          [target],
          target.location,
        )

        let answer = simplifyMatch(
          mod,
          [...freshVars, ...restTargets],
          group.clauses,
          defaultExp,
          location,
        )

        for (const i of range(group.dataConstructor.fields.length)) {
          const field = group.dataConstructor.fields[i]

          const dataFieldAccessorName = `${group.dataConstructor.name}-${field.name}`
          const dataFieldAccessor = M.modNameIsAsDefined(
            mod,
            dataFieldAccessorName,
          )
            ? M.Var(dataFieldAccessorName, answer.location)
            : M.QualifiedVar(path, dataFieldAccessorName, answer.location)

          answer = M.Let1(
            freshVars[i].name,
            M.Apply(dataFieldAccessor, [target], answer.location),
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

function groupClausesByHeadDataConstructor(
  mod: M.Mod,
  clauses: Array<M.MatchClause>,
): Array<GroupByHeadDataConstructor> {
  const definition = findAlgebraicTypeDefinitionFromClauses(mod, clauses)
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

function findAlgebraicTypeDefinitionFromClauses(
  mod: M.Mod,
  clauses: Array<M.MatchClause>,
): M.AlgebraicTypeDefinition {
  let definition: M.AlgebraicTypeDefinition | undefined = undefined
  for (const clause of clauses) {
    assert(clause.patterns.length > 0)
    const [pattern, ...restPatterns] = clause.patterns
    const dataConstructor = M.dataPatternDataConstructor(mod, pattern)
    if (definition === undefined) {
      definition = dataConstructor.definition
    } else if (dataConstructor.definition !== definition) {
      let message = `[findAlgebraicTypeDefinitionFromClauses] datatype definition mismatch`
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
