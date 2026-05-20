import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

// Like `expSubst` but without capture avoidance.
// Stops at a binding when the bound name equals `name` (shadowing).
// Does NOT alpha-rename, even when free names in `rhs` would be captured.

export function expNaiveSubst(exp: M.Exp, name: string, rhs: M.Exp): M.Exp {
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
      if (exp.parameters.includes(name)) return exp
      return M.Lambda(
        exp.parameters,
        expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "Polymorphic": {
      if (exp.parameters.includes(name)) return exp
      return M.Polymorphic(
        exp.parameters,
        expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "Let1": {
      return M.Let1(
        exp.name,
        expNaiveSubst(exp.rhs, name, rhs),
        exp.name === name ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "Let": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const shadowed = allNames.has(name)
      return M.Let(
        exp.bindings.map((b) =>
          M.Binding(b.name, expNaiveSubst(b.rhs, name, rhs), b.location),
        ),
        shadowed ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "LetStar": {
      const newBindings: Array<M.Binding> = []
      let shadowed = false
      for (const b of exp.bindings) {
        const newRhs = shadowed ? b.rhs : expNaiveSubst(b.rhs, name, rhs)
        newBindings.push(M.Binding(b.name, newRhs, b.location))
        if (b.name === name) shadowed = true
      }
      return M.LetStar(
        newBindings,
        shadowed ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "Letrec": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const shadowed = allNames.has(name)
      return M.Letrec(
        shadowed
          ? exp.bindings
          : exp.bindings.map((b) =>
              M.Binding(b.name, expNaiveSubst(b.rhs, name, rhs), b.location),
            ),
        shadowed ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "LetrecStar": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const shadowed = allNames.has(name)
      return M.LetrecStar(
        shadowed
          ? exp.bindings
          : exp.bindings.map((b) =>
              M.Binding(b.name, expNaiveSubst(b.rhs, name, rhs), b.location),
            ),
        shadowed ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "Match": {
      const newTargets = exp.targets.map((t) => expNaiveSubst(t, name, rhs))
      const newClauses = exp.clauses.map((clause) => {
        const patternsBoundNames = setUnionMany(
          clause.patterns.map(M.patternBoundNames),
        )
        const shadowed = patternsBoundNames.has(name)
        return M.MatchClause(
          clause.patterns,
          shadowed ? clause.body : expNaiveSubst(clause.body, name, rhs),
          clause.location,
        )
      })
      return M.Match(newTargets, newClauses, exp.location)
    }

    case "Begin": {
      const newSequence: Array<M.Exp> = []
      let shadowed = false
      for (const element of exp.sequence) {
        if (element.kind === "LocalDefine") {
          const body = shadowed
            ? element.body
            : expNaiveSubst(element.body, name, rhs)
          newSequence.push(
            M.LocalDefine(
              element.name,
              element.parameters,
              body,
              element.location,
            ),
          )
          if (element.name === name) shadowed = true
        } else if (element.kind === "Assign") {
          const newRhs = shadowed
            ? element.rhs
            : expNaiveSubst(element.rhs, name, rhs)
          newSequence.push(M.Assign(element.name, newRhs, element.location))
          if (element.name === name) shadowed = true
        } else {
          newSequence.push(
            shadowed ? element : expNaiveSubst(element, name, rhs),
          )
        }
      }
      return M.Begin(newSequence, exp.location)
    }

    case "LocalDefine": {
      let message = `[expNaiveSubst] local (define) can only appear in (begin)`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "Assign": {
      let message = `[expNaiveSubst] (=) can only appear in (begin)`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "Apply": {
      return M.Apply(
        expNaiveSubst(exp.target, name, rhs),
        exp.args.map((a) => expNaiveSubst(a, name, rhs)),
        exp.location,
      )
    }

    case "Pipe": {
      return M.Pipe(
        expNaiveSubst(exp.target, name, rhs),
        exp.steps.map((s) => expNaiveSubst(s, name, rhs)),
        exp.location,
      )
    }

    case "Chain": {
      return M.Chain(
        exp.steps.map((s) => expNaiveSubst(s, name, rhs)),
        exp.location,
      )
    }

    case "Compose": {
      return M.Compose(
        exp.steps.map((s) => expNaiveSubst(s, name, rhs)),
        exp.location,
      )
    }

    case "Begin1": {
      return M.Begin1(
        expNaiveSubst(exp.head, name, rhs),
        expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "If": {
      return M.If(
        expNaiveSubst(exp.condition, name, rhs),
        expNaiveSubst(exp.consequent, name, rhs),
        expNaiveSubst(exp.alternative, name, rhs),
        exp.location,
      )
    }

    case "When": {
      return M.When(
        expNaiveSubst(exp.condition, name, rhs),
        expNaiveSubst(exp.consequent, name, rhs),
        exp.location,
      )
    }

    case "Unless": {
      return M.Unless(
        expNaiveSubst(exp.condition, name, rhs),
        expNaiveSubst(exp.alternative, name, rhs),
        exp.location,
      )
    }

    case "And": {
      return M.And(
        exp.exps.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "Or": {
      return M.Or(
        exp.exps.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "Cond": {
      return M.Cond(
        exp.clauses.map((clause) => ({
          question: expNaiveSubst(clause.question, name, rhs),
          answer: expNaiveSubst(clause.answer, name, rhs),
          location: clause.location,
        })),
        exp.location,
      )
    }

    case "LiteralList": {
      return M.LiteralList(
        exp.elements.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "LiteralSet": {
      return M.LiteralSet(
        exp.elements.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "LiteralHash": {
      return M.LiteralHash(
        exp.entries.map((entry) => ({
          key: expNaiveSubst(entry.key, name, rhs),
          value: expNaiveSubst(entry.value, name, rhs),
        })),
        exp.location,
      )
    }

    case "Arrow": {
      return M.Arrow(
        exp.argTypes.map((t) => expNaiveSubst(t, name, rhs)),
        expNaiveSubst(exp.retType, name, rhs),
        exp.location,
      )
    }

    case "The": {
      return M.The(
        expNaiveSubst(exp.type, name, rhs),
        expNaiveSubst(exp.exp, name, rhs),
        exp.location,
      )
    }
  }
}
