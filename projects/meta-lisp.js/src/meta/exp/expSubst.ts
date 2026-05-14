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
    case "QualifiedVar":
    case "Quote": {
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

    case "Let": {
      return substLet(exp, name, rhs)
    }

    case "LetStar": {
      return substLetStar(exp, name, rhs)
    }

    case "Letrec": {
      return substLetrec(exp, name, rhs)
    }

    case "LocalDefine": {
      return substLocalDefine(exp, name, rhs)
    }

    case "LetrecStar": {
      return substLetrecStar(exp, name, rhs)
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

    case "Pipe": {
      return M.Pipe(
        expSubst(exp.target, name, rhs),
        exp.steps.map((s) => expSubst(s, name, rhs)),
        exp.location,
      )
    }

    case "Chain": {
      return M.Chain(
        exp.steps.map((s) => expSubst(s, name, rhs)),
        exp.location,
      )
    }

    case "Compose": {
      return M.Compose(
        exp.steps.map((s) => expSubst(s, name, rhs)),
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

    case "Begin": {
      return M.Begin(
        exp.sequence.map((e) => expSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "Assign": {
      return M.Assign(exp.name, expSubst(exp.rhs, name, rhs), exp.location)
    }

    case "If": {
      return M.If(
        expSubst(exp.condition, name, rhs),
        expSubst(exp.consequent, name, rhs),
        expSubst(exp.alternative, name, rhs),
        exp.location,
      )
    }

    case "When": {
      return M.When(
        expSubst(exp.condition, name, rhs),
        expSubst(exp.consequent, name, rhs),
        exp.location,
      )
    }

    case "Unless": {
      return M.Unless(
        expSubst(exp.condition, name, rhs),
        expSubst(exp.alternative, name, rhs),
        exp.location,
      )
    }

    case "And": {
      return M.And(
        exp.exps.map((e) => expSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "Or": {
      return M.Or(
        exp.exps.map((e) => expSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "Cond": {
      return M.Cond(
        exp.clauses.map((clause) => ({
          question: expSubst(clause.question, name, rhs),
          answer: expSubst(clause.answer, name, rhs),
          location: clause.location,
        })),
        exp.location,
      )
    }

    case "LiteralList": {
      return M.LiteralList(
        exp.elements.map((e) => expSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "LiteralSet": {
      return M.LiteralSet(
        exp.elements.map((e) => expSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "LiteralHash": {
      return M.LiteralHash(
        exp.entries.map((entry) => ({
          key: expSubst(entry.key, name, rhs),
          value: expSubst(entry.value, name, rhs),
        })),
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

function substLet(exp: M.Let, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const newBindings = exp.bindings.map((b) =>
    M.Binding(b.name, expSubst(b.rhs, name, rhs), b.location),
  )

  const allNames = new Set(exp.bindings.map((b) => b.name))
  const conflict = [...allNames].some((n) => rhsFreeNames.has(n))

  if (!conflict) {
    if (allNames.has(name)) return M.Let(newBindings, exp.body, exp.location)
    return M.Let(newBindings, expSubst(exp.body, name, rhs), exp.location)
  }

  const usedNames = M.expOccurredNames(exp)
  let body = exp.body
  const renamedBindings = newBindings.map((b) => {
    if (rhsFreeNames.has(b.name)) {
      const fresh = M.generateRelativeFreshName(b.name, usedNames)
      body = expSubst(body, b.name, M.Var(fresh, exp.location))
      return M.Binding(fresh, b.rhs, b.location)
    }
    return b
  })

  const newAllNames = new Set(renamedBindings.map((b) => b.name))
  if (newAllNames.has(name)) {
    return M.Let(renamedBindings, body, exp.location)
  }
  return M.Let(renamedBindings, expSubst(body, name, rhs), exp.location)
}

function substLetStar(exp: M.LetStar, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const usedNames = M.expOccurredNames(exp)

  const newBindings: Array<M.Binding> = []
  let body = exp.body
  const renaming = new Map<string, string>()

  for (const b of exp.bindings) {
    let newRhs = expSubst(b.rhs, name, rhs)
    for (const [oldName, freshName] of renaming) {
      newRhs = expSubst(newRhs, oldName, M.Var(freshName, exp.location))
    }

    if (rhsFreeNames.has(b.name)) {
      const fresh = M.generateRelativeFreshName(b.name, usedNames)
      renaming.set(b.name, fresh)
      newBindings.push(M.Binding(fresh, newRhs, b.location))
      body = expSubst(body, b.name, M.Var(fresh, exp.location))
    } else {
      newBindings.push(M.Binding(b.name, newRhs, b.location))
    }
  }

  const newAllNames = new Set(newBindings.map((b) => b.name))
  if (newAllNames.has(name)) {
    return M.LetStar(newBindings, body, exp.location)
  }
  return M.LetStar(newBindings, expSubst(body, name, rhs), exp.location)
}

function substLetrecStar(exp: M.LetrecStar, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const allNames = new Set(exp.bindings.map((b) => b.name))
  const nameShadowed = allNames.has(name)
  const conflict = [...allNames].some((n) => rhsFreeNames.has(n))

  const newRHSes = nameShadowed
    ? exp.bindings.map((b) => b.rhs)
    : exp.bindings.map((b) => expSubst(b.rhs, name, rhs))
  let newBody = nameShadowed ? exp.body : expSubst(exp.body, name, rhs)

  if (!conflict) {
    if (nameShadowed) return exp
    return M.LetrecStar(
      exp.bindings.map((b, i) => M.Binding(b.name, newRHSes[i], b.location)),
      newBody,
      exp.location,
    )
  }

  const usedNames = M.expOccurredNames(exp)
  const renaming = new Map<string, string>()

  for (const b of exp.bindings) {
    if (rhsFreeNames.has(b.name)) {
      renaming.set(b.name, M.generateRelativeFreshName(b.name, usedNames))
    }
  }

  let finalBody = newBody
  let finalRHSes = [...newRHSes]
  for (const [oldName, freshName] of renaming) {
    for (let i = 0; i < finalRHSes.length; i++) {
      finalRHSes[i] = expSubst(
        finalRHSes[i],
        oldName,
        M.Var(freshName, exp.location),
      )
    }
    finalBody = expSubst(finalBody, oldName, M.Var(freshName, exp.location))
  }

  const newBindings = exp.bindings.map((b, i) =>
    M.Binding(renaming.get(b.name) ?? b.name, finalRHSes[i], b.location),
  )

  return M.LetrecStar(newBindings, finalBody, exp.location)
}

function substLocalDefine(exp: M.LocalDefine, name: string, rhs: M.Exp): M.Exp {
  if (exp.name === name) return exp
  return M.LocalDefine(
    exp.name,
    exp.parameters,
    expSubst(exp.body, name, rhs),
    exp.location,
  )
}

function substLetrec(exp: M.Letrec, name: string, rhs: M.Exp): M.Exp {
  const rhsFreeNames = M.expFreeNames(new Set(), rhs)
  const allNames = new Set(exp.bindings.map((b) => b.name))
  const nameShadowed = allNames.has(name)
  const conflict = [...allNames].some((n) => rhsFreeNames.has(n))

  const newRHSes = nameShadowed
    ? exp.bindings.map((b) => b.rhs)
    : exp.bindings.map((b) => expSubst(b.rhs, name, rhs))
  let newBody = nameShadowed ? exp.body : expSubst(exp.body, name, rhs)

  if (!conflict) {
    if (nameShadowed) return exp
    return M.Letrec(
      exp.bindings.map((b, i) => M.Binding(b.name, newRHSes[i], b.location)),
      newBody,
      exp.location,
    )
  }

  const usedNames = M.expOccurredNames(exp)
  const renaming = new Map<string, string>()

  for (const b of exp.bindings) {
    if (rhsFreeNames.has(b.name)) {
      renaming.set(b.name, M.generateRelativeFreshName(b.name, usedNames))
    }
  }

  let finalBody = newBody
  let finalRHSes = [...newRHSes]
  for (const [oldName, freshName] of renaming) {
    for (let i = 0; i < finalRHSes.length; i++) {
      finalRHSes[i] = expSubst(
        finalRHSes[i],
        oldName,
        M.Var(freshName, exp.location),
      )
    }
    finalBody = expSubst(finalBody, oldName, M.Var(freshName, exp.location))
  }

  const newBindings = exp.bindings.map((b, i) =>
    M.Binding(renaming.get(b.name) ?? b.name, finalRHSes[i], b.location),
  )

  return M.Letrec(newBindings, finalBody, exp.location)
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
