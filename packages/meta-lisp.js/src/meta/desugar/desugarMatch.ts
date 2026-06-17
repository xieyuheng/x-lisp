import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

// Desugar `(match)`, the basic idea is:
//
//     (match target
//       ((ctor1 v11 v12 ...) body1)
//       ((ctor2 v21 v22 ...) body2)
//       ...)
//
// =>
//
//     (cond
//       ((ctor1? target)
//        (let* ((v11 (ctor1-accessor1 target))
//               (v12 (ctor1-accessor2 target))
//               ...)
//          body1))
//       ((ctor2? target)
//        (let* ((v21 (ctor2-accessor1 target))
//               (v22 (ctor2-accessor2 target))
//               ...)
//          body2))
//       ...)
//
// We first need to generalize
//
//     (match target
//       (pattern body)
//       ...)
//
// to
//
//     (match-many (target ...)
//       ((pattern ...) body)
//       ...)
//
// When all clause heads are var patterns:
//
//     (match-many (target <target> ...)
//       ((v1 <pattern> ...) <body>)
//       ((v2 <pattern> ...) <body>)
//       ...)
//
// =>
//
//     (match-many (<target> ...)
//       ((<pattern> ...) (let ((v1 target)) <body>))
//       ((<pattern> ...) (let ((v2 target)) <body>))
//       ...)
//
// When all clause heads are data patterns:
//
//     (match-many (target <target> ...)
//       (((ctor1 x1 ...) <pattern> ...) <body>)
//       (((ctor1 y1 ...) <pattern> ...) <body>)
//       (((ctor2 x2 ...) <pattern> ...) <body>)
//       (((ctor2 y2 ...) <pattern> ...) <body>)
//       ...)
//
// first group by head constructors:
//
//     (match-many (target <target> ...)
//       (((ctor1 x1 ...) <pattern> ...) <body>)
//       (((ctor1 y1 ...) <pattern> ...) <body>)
//       ...)
//
//     (match-many (target <target> ...)
//       (((ctor2 x2 ...) <pattern> ...) <body>)
//       (((ctor2 y2 ...) <pattern> ...) <body>)
//       ...)
//
// then spread the pattern vars in the data patterns:
//
//     (match-many ((ctor1-accessor1 target) ... <target> ...)
//       ((x1 ... <pattern> ...) <body>)
//       ((y1 ... <pattern> ...) <body>)
//       ...)
//
//     (match-many ((ctor2-accessor1 target) ... <target> ...)
//       ((x2 ... <pattern> ...) <body>)
//       ((y2 ... <pattern> ...) <body>)
//       ...)
//
// To handled mixed head patterns,
// we first group clauses by head pattern kind.

export type DesugarMatchCtx = {
  scope: M.FragmentScope
  currentModName: string
  algebraicAnalysisReport: M.AlgebraicAnalysisReport
  pkgId: string
}

export function makeDesugarMatchCtx(
  scope: M.FragmentScope,
  currentModName: string,
  algebraicAnalysisReport: M.AlgebraicAnalysisReport,
  pkgId: string,
): DesugarMatchCtx {
  return { scope, currentModName, algebraicAnalysisReport, pkgId }
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
    return clauses[0].body
  }

  if (clauses.every(isVarPatternClause)) {
    const [target, ...restTargets] = targets
    return desugarMatch(
      ctx,
      restTargets,
      clauses.map((clause) => desugarVarPatternClause(target, clause)),
      defaultExp,
      location,
    )
  } else if (clauses.every(isDataPatternClause)) {
    const groups = groupClausesByHeadDataConstructor(ctx, clauses)
    return M.CondExp(
      groups.map((group) =>
        desugarDataConstructorClauseGroup(
          ctx,
          group,
          targets,
          defaultExp,
          location,
        ),
      ),
      location,
    )
  } else {
    const groups = groupClausesByHeadPatternKind(clauses)
    return groups.reduceRight(
      (accumulatedExp, group) =>
        desugarMatch(ctx, targets, group, accumulatedExp, location),
      defaultExp,
    )
  }
}

function desugarVarPatternClause(
  target: M.Exp,
  clause: M.MatchClause,
): M.MatchClause {
  const [pattern, ...restPatterns] = clause.patterns
  if (pattern.kind !== "VarExp") {
    let message = `[desugarVarPatternClause] expect var pattern`
    throw new S.ErrorWithSourceLocation(message, pattern.location)
  }
  return M.MatchClause(
    restPatterns,
    M.Let1Exp(pattern.name, target, clause.body, clause.location),
    clause.location,
  )
}

function isVarPatternClause(clause: M.MatchClause): boolean {
  return clause.patterns.length > 0 && M.isVarPattern(clause.patterns[0])
}

function isDataPatternClause(clause: M.MatchClause): boolean {
  return clause.patterns.length > 0 && M.isDataPattern(clause.patterns[0])
}

type DataConstructorClauseGroup = {
  dataConstructorInfo: M.DataConstructorInfo
  clauses: Array<M.MatchClause>
}

function desugarDataConstructorClauseGroup(
  ctx: DesugarMatchCtx,
  group: DataConstructorClauseGroup,
  targets: Array<M.Exp>,
  defaultExp: M.Exp,
  location: S.SourceLocation,
): M.CondClause {
  const [target, ...restTargets] = targets

  const predicate = M.QualifiedVarExp(
    group.dataConstructorInfo.pkgId,
    group.dataConstructorInfo.modName,
    group.dataConstructorInfo.predicateName,
    location,
  )

  const question = M.ApplyExp(predicate, [target], target.location)

  const newTargets = group.dataConstructorInfo.accessorNames.map(
    (accessorName) =>
      M.ApplyExp(
        M.QualifiedVarExp(
          group.dataConstructorInfo.pkgId,
          group.dataConstructorInfo.modName,
          accessorName,
          location,
        ),
        [target],
        target.location,
      ),
  )

  const answer = desugarMatch(
    ctx,
    [...newTargets, ...restTargets],
    group.clauses.map(clauseSpreadFirstDataPattern),
    defaultExp,
    location,
  )

  return M.CondClause(question, answer, location)
}

function lookupAlgebraicTypeInfo(
  ctx: DesugarMatchCtx,
  clause: M.MatchClause,
): M.AlgebraicTypeInfo {
  const [pattern] = clause.patterns
  if (!M.isDataPattern(pattern)) {
    let message = `[lookupAlgebraicTypeInfo] expected data pattern`
    message += `\n  pattern: ${M.formatExp(pattern)}`
    throw new S.ErrorWithSourceLocation(message, clause.location)
  }
  const { pkgName, modName, name } = resolveCtorQualifiedName(
    ctx,
    pattern.target,
  )
  const info = ctx.algebraicAnalysisReport.dataConstructorInfos.get(
    M.algebraicKey(pkgName, modName, name),
  )
  if (!info) {
    let message = `[lookupAlgebraicTypeInfo] undefined data constructor`
    message += `\n  pkgName: ${pkgName}`
    message += `\n  modName: ${modName}`
    message += `\n  name: ${name}`
    message += `\n  key: ${pkgName}/${modName}/${name}`
    throw new S.ErrorWithSourceLocation(message, clause.location)
  }
  const algebraicTypeInfo = ctx.algebraicAnalysisReport.algebraicTypeInfos.get(
    M.algebraicKey(info.pkgId, info.modName, info.typeName),
  )
  if (!algebraicTypeInfo) {
    let message = `[lookupAlgebraicTypeInfo] cannot find algebraic type info`
    message += `\n  constructor name: ${info.name}`
    message += `\n  type name: ${info.typeName}`
    message += `\n  module name: ${info.modName}`
    throw new S.ErrorWithSourceLocation(message, clause.location)
  }
  return algebraicTypeInfo
}

function lookupSameAlgebraicType(
  ctx: DesugarMatchCtx,
  clauses: Array<M.MatchClause>,
): M.AlgebraicTypeInfo {
  const first = lookupAlgebraicTypeInfo(ctx, clauses[0])
  for (const clause of clauses) {
    const current = lookupAlgebraicTypeInfo(ctx, clause)
    if (current.modName !== first.modName || current.name !== first.name) {
      let message = `[lookupSameAlgebraicType] algebraic data type mismatch`
      message += `\n  first: ${first.modName}/${first.name}`
      message += `\n  current: ${current.modName}/${current.name}`
      throw new S.ErrorWithSourceLocation(message, clause.location)
    }
  }
  return first
}

function clauseStartsWithDataConstructor(
  ctx: DesugarMatchCtx,
  clause: M.MatchClause,
  info: M.DataConstructorInfo,
): boolean {
  const [pattern] = clause.patterns
  if (!M.isDataPattern(pattern)) return false
  const { modName, name } = resolveCtorQualifiedName(ctx, pattern.target)
  return modName === info.modName && name === info.name
}

function clauseSpreadFirstDataPattern(clause: M.MatchClause): M.MatchClause {
  const [pattern, ...restPatterns] = clause.patterns
  const argPatterns = M.isDataPattern(pattern)
    ? M.dataPatternArgPatterns(pattern)
    : []
  return M.MatchClause(
    [...argPatterns, ...restPatterns],
    clause.body,
    clause.location,
  )
}

function groupClausesByHeadDataConstructor(
  ctx: DesugarMatchCtx,
  clauses: Array<M.MatchClause>,
): Array<DataConstructorClauseGroup> {
  const algebraicTypeInfo = lookupSameAlgebraicType(ctx, clauses)

  return algebraicTypeInfo.constructorNames.map((ctorName) => {
    const key = M.algebraicKey(
      algebraicTypeInfo.pkgId,
      algebraicTypeInfo.modName,
      ctorName,
    )
    const info = ctx.algebraicAnalysisReport.dataConstructorInfos.get(key)!
    const grouped = clauses.filter((c) =>
      clauseStartsWithDataConstructor(ctx, c, info),
    )
    return { dataConstructorInfo: info, clauses: grouped }
  })
}

function resolveCtorQualifiedName(
  ctx: DesugarMatchCtx,
  ctor: M.Exp,
): { pkgName: string; modName: string; name: string } {
  if (ctor.kind === "QualifiedVarExp") {
    return { pkgName: ctor.pkgName, modName: ctor.modName, name: ctor.name }
  }

  if (ctor.kind === "VarExp") {
    const entry = ctx.scope.importedNames.get(ctor.name)
    if (entry) {
      return {
        pkgName: entry.pkgName,
        modName: entry.modName,
        name: entry.name,
      }
    } else {
      return {
        pkgName: ctx.pkgId,
        modName: ctx.currentModName,
        name: ctor.name,
      }
    }
  }

  let message = "[resolveCtorQualifiedName] unhandled ctor kind"
  throw new S.ErrorWithSourceLocation(message, ctor.location)
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
  return (
    isVarPatternClause(a) === isVarPatternClause(b) ||
    isDataPatternClause(a) === isDataPatternClause(b)
  )
}

export function makeDefaultExp(
  targets: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  const parts: Array<M.Exp> = [
    M.StringExp("pattern mismatch, no match-clause for targets:", location),
  ]
  for (const target of targets) {
    parts.push(M.StringExp(" ", location))
    parts.push(
      M.ApplyExp(
        M.QualifiedVarExp("meta-builtin", "builtin", "format", location),
        [target],
        location,
      ),
    )
  }
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "builtin", "error", location),
    [M.StringConcatExp(parts, location)],
    location,
  )
}
