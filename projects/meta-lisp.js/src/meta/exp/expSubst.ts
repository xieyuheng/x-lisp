import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function expSubst(exp: M.Exp, name: string, rhs: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "QualifiedVar": {
      return exp
    }

    case "Var": {
      if (exp.name === name) return rhs
      return exp
    }

    case "Lambda": {
      return substLambda(exp, name, rhs)
    }

    case "Polymorphic": {
      return substPolymorphic(exp, name, rhs)
    }

    case "Let1": {
      return substLet1(exp, name, rhs)
    }

    case "Match": {
      return substMatch(exp, name, rhs)
    }

    case "Apply": {
      return M.Apply(
        expSubst(exp.target, name, rhs),
        exp.args.map((a) => expSubst(a, name, rhs)),
        exp.location,
      )
    }

    case "Begin1": {
      return M.Begin1(
        expSubst(exp.head, name, rhs),
        expSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "If": {
      return M.If(
        expSubst(exp.condition, name, rhs),
        expSubst(exp.consequent, name, rhs),
        expSubst(exp.alternative, name, rhs),
        exp.location,
      )
    }

    case "Arrow": {
      return M.Arrow(
        exp.argTypes.map((t) => expSubst(t, name, rhs)),
        expSubst(exp.retType, name, rhs),
        exp.location,
      )
    }

    case "The": {
      return M.The(
        expSubst(exp.type, name, rhs),
        expSubst(exp.exp, name, rhs),
        exp.location,
      )
    }

    default: {
      let message = `[expSubst] unhandled exp kind: ${exp.kind}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      throw new Error(message)
    }
  }
}

function substLambda(exp: M.Lambda, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const conflict = exp.parameters.some((p) => rhsFreeNames.has(p))

  if (!conflict) {
    if (exp.parameters.includes(name)) return exp
    return M.Lambda(exp.parameters, expSubst(exp.body, name, rhs), exp.location)
  }

  const usedNames = M.expOccurredNames(exp)
  let body = exp.body
  const newParameters = exp.parameters.map((p) => {
    if (rhsFreeNames.has(p)) {
      const fresh = M.generateRelativeFreshName(p, usedNames)
      body = expSubst(body, p, M.Var(fresh, exp.location))
      return fresh
    }
    return p
  })

  if (newParameters.includes(name)) {
    return M.Lambda(newParameters, body, exp.location)
  }
  return M.Lambda(newParameters, expSubst(body, name, rhs), exp.location)
}

function substPolymorphic(exp: M.Polymorphic, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const conflict = exp.parameters.some((p) => rhsFreeNames.has(p))

  if (!conflict) {
    if (exp.parameters.includes(name)) return exp
    return M.Polymorphic(
      exp.parameters,
      expSubst(exp.body, name, rhs),
      exp.location,
    )
  }

  const usedNames = M.expOccurredNames(exp)
  let body = exp.body
  const newParameters = exp.parameters.map((p) => {
    if (rhsFreeNames.has(p)) {
      const fresh = M.generateRelativeFreshName(p, usedNames)
      body = expSubst(body, p, M.Var(fresh, exp.location))
      return fresh
    }
    return p
  })

  if (newParameters.includes(name)) {
    return M.Polymorphic(newParameters, body, exp.location)
  }
  return M.Polymorphic(newParameters, expSubst(body, name, rhs), exp.location)
}

function substLet1(exp: M.Let1, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const newRhs = expSubst(exp.rhs, name, rhs)

  if (exp.name === name) {
    return M.Let1(exp.name, newRhs, exp.body, exp.location)
  }

  if (rhsFreeNames.has(exp.name)) {
    const usedNames = M.expOccurredNames(exp)
    const fresh = M.generateRelativeFreshName(exp.name, usedNames)
    const renamedBody = expSubst(exp.body, exp.name, M.Var(fresh, exp.location))
    return M.Let1(fresh, newRhs, expSubst(renamedBody, name, rhs), exp.location)
  }

  return M.Let1(exp.name, newRhs, expSubst(exp.body, name, rhs), exp.location)
}

function substMatch(exp: M.Match, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const newTargets = exp.targets.map((t) => expSubst(t, name, rhs))

  const newClauses = exp.clauses.map((clause) => {
    const patternsBoundNames = setUnionMany(
      clause.patterns.map(M.patternBoundNames),
    )
    const conflict = [...patternsBoundNames].some((p) => rhsFreeNames.has(p))

    if (!conflict) {
      if (patternsBoundNames.has(name)) return clause
      return M.MatchClause(
        clause.patterns,
        expSubst(clause.body, name, rhs),
        clause.location,
      )
    }

    const usedNames = M.expOccurredNames(exp)
    let newBody = clause.body
    let newPatterns = [...clause.patterns]

    for (const p of patternsBoundNames) {
      if (rhsFreeNames.has(p)) {
        const fresh = M.generateRelativeFreshName(p, usedNames)
        newPatterns = newPatterns.map((pat) =>
          renameVarInPattern(pat, p, fresh),
        )
        newBody = expSubst(newBody, p, M.Var(fresh, clause.location))
      }
    }

    if (patternsBoundNames.has(name)) {
      return M.MatchClause(newPatterns, newBody, clause.location)
    }
    return M.MatchClause(
      newPatterns,
      expSubst(newBody, name, rhs),
      clause.location,
    )
  })

  return M.Match(newTargets, newClauses, exp.location)
}

function renameVarInPattern(
  pattern: M.Exp,
  name: string,
  freshName: string,
): M.Exp {
  if (M.isVarPattern(pattern)) {
    if (pattern.name === name) {
      return M.Var(freshName, pattern.location)
    }
    return pattern
  }

  if (M.isDataPattern(pattern)) {
    return M.Apply(
      pattern.target,
      pattern.args.map((arg) => renameVarInPattern(arg, name, freshName)),
      pattern.location,
    )
  }

  let message = `[renameVarInPattern] unhandled pattern`
  if (pattern.location)
    throw new S.ErrorWithSourceLocation(message, pattern.location)
  throw new Error(message)
}
