import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function expSubst(exp: M.Exp, name: string, rhs: M.Exp): M.Exp {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp":
    case "QualifiedVarExp": {
      return exp
    }

    case "VarExp": {
      if (exp.name === name) return rhs
      return exp
    }

    case "LambdaExp": {
      return substLambda(exp, name, rhs)
    }

    case "PolymorphicExp": {
      return substPolymorphic(exp, name, rhs)
    }

    case "Let1Exp": {
      return substLet1(exp, name, rhs)
    }

    case "MatchExp": {
      return substMatch(exp, name, rhs)
    }

    case "ApplyExp": {
      return M.ApplyExp(
        expSubst(exp.target, name, rhs),
        exp.args.map((a) => expSubst(a, name, rhs)),
        exp.location,
      )
    }

    case "Begin1Exp": {
      return M.Begin1Exp(
        expSubst(exp.head, name, rhs),
        expSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "IfExp": {
      return M.IfExp(
        expSubst(exp.condition, name, rhs),
        expSubst(exp.consequent, name, rhs),
        expSubst(exp.alternative, name, rhs),
        exp.location,
      )
    }

    case "ArrowExp": {
      return M.ArrowExp(
        exp.argTypes.map((t) => expSubst(t, name, rhs)),
        expSubst(exp.retType, name, rhs),
        exp.location,
      )
    }

    case "TheExp": {
      return M.TheExp(
        expSubst(exp.type, name, rhs),
        expSubst(exp.exp, name, rhs),
        exp.location,
      )
    }

    default: {
      let message = `[expSubst] unhandled exp kind: ${exp.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
  }
}

function substLambda(exp: M.LambdaExp, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const conflict = exp.parameters.some((p) => rhsFreeNames.has(p))

  if (!conflict) {
    if (exp.parameters.includes(name)) return exp
    return M.LambdaExp(
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
      body = expSubst(body, p, M.VarExp(fresh, exp.location))
      return fresh
    }
    return p
  })

  if (newParameters.includes(name)) {
    return M.LambdaExp(newParameters, body, exp.location)
  }
  return M.LambdaExp(newParameters, expSubst(body, name, rhs), exp.location)
}

function substPolymorphic(
  exp: M.PolymorphicExp,
  name: string,
  rhs: M.Exp,
): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const conflict = exp.parameters.some((p) => rhsFreeNames.has(p))

  if (!conflict) {
    if (exp.parameters.includes(name)) return exp
    return M.PolymorphicExp(
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
      body = expSubst(body, p, M.VarExp(fresh, exp.location))
      return fresh
    }
    return p
  })

  if (newParameters.includes(name)) {
    return M.PolymorphicExp(newParameters, body, exp.location)
  }
  return M.PolymorphicExp(
    newParameters,
    expSubst(body, name, rhs),
    exp.location,
  )
}

function substLet1(exp: M.Let1Exp, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const newRhs = expSubst(exp.rhs, name, rhs)

  if (exp.name === name) {
    return M.Let1Exp(exp.name, newRhs, exp.body, exp.location)
  }

  if (rhsFreeNames.has(exp.name)) {
    const usedNames = M.expOccurredNames(exp)
    const fresh = M.generateRelativeFreshName(exp.name, usedNames)
    const renamedBody = expSubst(
      exp.body,
      exp.name,
      M.VarExp(fresh, exp.location),
    )
    return M.Let1Exp(
      fresh,
      newRhs,
      expSubst(renamedBody, name, rhs),
      exp.location,
    )
  }

  return M.Let1Exp(
    exp.name,
    newRhs,
    expSubst(exp.body, name, rhs),
    exp.location,
  )
}

function substMatch(exp: M.MatchExp, name: string, rhs: M.Exp): M.Exp {
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
        newBody = expSubst(newBody, p, M.VarExp(fresh, clause.location))
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

  return M.MatchExp(newTargets, newClauses, exp.location)
}

function renameVarInPattern(
  pattern: M.Exp,
  name: string,
  freshName: string,
): M.Exp {
  if (M.isVarPattern(pattern)) {
    if (pattern.name === name) {
      return M.VarExp(freshName, pattern.location)
    }
    return pattern
  }

  if (M.isDataPattern(pattern)) {
    return M.ApplyExp(
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
