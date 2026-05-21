import * as M from "../index.ts"
import type { Term } from "./Term.ts"

export function termSubst(term: Term, name: string, rhs: Term): Term {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm":
    case "QualifiedVarTerm": {
      return term
    }

    case "VarTerm": {
      if (term.name === name) return rhs
      return term
    }

    case "LambdaTerm": {
      return substLambda(term, name, rhs)
    }

    case "PolymorphicTerm": {
      return substPolymorphic(term, name, rhs)
    }

    case "Let1Term": {
      return substLet1(term, name, rhs)
    }

    case "ApplyTerm": {
      return M.ApplyTerm(
        termSubst(term.target, name, rhs),
        term.args.map((a) => termSubst(a, name, rhs)),
        term.location,
      )
    }

    case "Begin1Term": {
      return M.Begin1Term(
        termSubst(term.head, name, rhs),
        termSubst(term.body, name, rhs),
        term.location,
      )
    }

    case "IfTerm": {
      return M.IfTerm(
        termSubst(term.condition, name, rhs),
        termSubst(term.consequent, name, rhs),
        termSubst(term.alternative, name, rhs),
        term.location,
      )
    }

    case "ArrowTerm": {
      return M.ArrowTerm(
        term.argTypes.map((t) => termSubst(t, name, rhs)),
        termSubst(term.retType, name, rhs),
        term.location,
      )
    }

    case "TheTerm": {
      return M.TheTerm(
        termSubst(term.type, name, rhs),
        termSubst(term.exp, name, rhs),
        term.location,
      )
    }
  }
}

function substLambda(term: M.LambdaTerm, name: string, rhs: Term): Term {
  const rhsFreeNames = M.termFreeNames(new Set(), rhs)
  const conflict = term.parameters.some((p) => rhsFreeNames.has(p))

  if (!conflict) {
    if (term.parameters.includes(name)) return term
    return M.LambdaTerm(
      term.parameters,
      termSubst(term.body, name, rhs),
      term.location,
    )
  }

  const usedNames = M.termOccurredNames(term)
  let body = term.body
  const newParameters = term.parameters.map((p) => {
    if (rhsFreeNames.has(p)) {
      const fresh = M.generateRelativeFreshName(p, usedNames)
      body = termSubst(body, p, M.VarTerm(fresh, term.location))
      return fresh
    }
    return p
  })

  if (newParameters.includes(name)) {
    return M.LambdaTerm(newParameters, body, term.location)
  }
  return M.LambdaTerm(newParameters, termSubst(body, name, rhs), term.location)
}

function substPolymorphic(
  term: M.PolymorphicTerm,
  name: string,
  rhs: Term,
): Term {
  const rhsFreeNames = M.termFreeNames(new Set(), rhs)
  const conflict = term.parameters.some((p) => rhsFreeNames.has(p))

  if (!conflict) {
    if (term.parameters.includes(name)) return term
    return M.PolymorphicTerm(
      term.parameters,
      termSubst(term.body, name, rhs),
      term.location,
    )
  }

  const usedNames = M.termOccurredNames(term)
  let body = term.body
  const newParameters = term.parameters.map((p) => {
    if (rhsFreeNames.has(p)) {
      const fresh = M.generateRelativeFreshName(p, usedNames)
      body = termSubst(body, p, M.VarTerm(fresh, term.location))
      return fresh
    }
    return p
  })

  if (newParameters.includes(name)) {
    return M.PolymorphicTerm(newParameters, body, term.location)
  }
  return M.PolymorphicTerm(
    newParameters,
    termSubst(body, name, rhs),
    term.location,
  )
}

function substLet1(term: M.Let1Term, name: string, rhs: Term): Term {
  const rhsFreeNames = M.termFreeNames(new Set(), rhs)
  const newRhs = termSubst(term.rhs, name, rhs)

  if (term.name === name) {
    return M.Let1Term(term.name, newRhs, term.body, term.location)
  }

  if (rhsFreeNames.has(term.name)) {
    const usedNames = M.termOccurredNames(term)
    const fresh = M.generateRelativeFreshName(term.name, usedNames)
    const renamedBody = termSubst(
      term.body,
      term.name,
      M.VarTerm(fresh, term.location),
    )
    return M.Let1Term(
      fresh,
      newRhs,
      termSubst(renamedBody, name, rhs),
      term.location,
    )
  }

  return M.Let1Term(
    term.name,
    newRhs,
    termSubst(term.body, name, rhs),
    term.location,
  )
}
