import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

// Exp substitution with shadowing but **without** capture avoidance.

export function expNaiveSubst(exp: M.Exp, name: string, rhs: M.Exp): M.Exp {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp":
    case "QualifiedVarExp":
    case "QuoteExp":
    case "SexpExp":
    case "CommentExp": {
      return exp
    }

    case "VarExp": {
      if (exp.name === name) return rhs
      return exp
    }

    case "LambdaExp": {
      if (exp.parameters.includes(name)) return exp
      return M.LambdaExp(
        exp.parameters,
        expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "PolymorphicExp": {
      if (exp.parameters.includes(name)) return exp
      return M.PolymorphicExp(
        exp.parameters,
        expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "Let1Exp": {
      return M.Let1Exp(
        exp.name,
        expNaiveSubst(exp.rhs, name, rhs),
        exp.name === name ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "LetExp": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const shadowed = allNames.has(name)
      return M.LetExp(
        exp.bindings.map((b) =>
          M.Binding(b.name, expNaiveSubst(b.rhs, name, rhs), b.location),
        ),
        shadowed ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "LetStarExp": {
      const newBindings: Array<M.Binding> = []
      let shadowed = false
      for (const b of exp.bindings) {
        const newRhs = shadowed ? b.rhs : expNaiveSubst(b.rhs, name, rhs)
        newBindings.push(M.Binding(b.name, newRhs, b.location))
        if (b.name === name) shadowed = true
      }
      return M.LetStarExp(
        newBindings,
        shadowed ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "LetrecExp": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const shadowed = allNames.has(name)
      return M.LetrecExp(
        shadowed
          ? exp.bindings
          : exp.bindings.map((b) =>
              M.Binding(b.name, expNaiveSubst(b.rhs, name, rhs), b.location),
            ),
        shadowed ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "LetrecStarExp": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const shadowed = allNames.has(name)
      return M.LetrecStarExp(
        shadowed
          ? exp.bindings
          : exp.bindings.map((b) =>
              M.Binding(b.name, expNaiveSubst(b.rhs, name, rhs), b.location),
            ),
        shadowed ? exp.body : expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "MatchExp": {
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
      return M.MatchExp(newTargets, newClauses, exp.location)
    }

    case "BeginExp": {
      const newSequence: Array<M.Exp> = []
      let shadowed = false
      for (const element of exp.sequence) {
        if (element.kind === "LocalDefineExp") {
          const body = shadowed
            ? element.body
            : expNaiveSubst(element.body, name, rhs)
          newSequence.push(
            M.LocalDefineExp(
              element.name,
              element.parameters,
              body,
              element.location,
            ),
          )
          if (element.name === name) shadowed = true
        } else if (element.kind === "AssignExp") {
          const newRhs = shadowed
            ? element.rhs
            : expNaiveSubst(element.rhs, name, rhs)
          newSequence.push(M.AssignExp(element.name, newRhs, element.location))
          if (element.name === name) shadowed = true
        } else {
          newSequence.push(
            shadowed ? element : expNaiveSubst(element, name, rhs),
          )
        }
      }
      return M.BeginExp(newSequence, exp.location)
    }

    case "LocalDefineExp": {
      let message = `[expNaiveSubst] local (define) can only appear in (begin)`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "AssignExp": {
      let message = `[expNaiveSubst] (=) can only appear in (begin)`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "ApplyExp": {
      return M.ApplyExp(
        expNaiveSubst(exp.target, name, rhs),
        exp.args.map((a) => expNaiveSubst(a, name, rhs)),
        exp.location,
      )
    }

    case "PipeExp": {
      return M.PipeExp(
        expNaiveSubst(exp.target, name, rhs),
        exp.steps.map((s) => expNaiveSubst(s, name, rhs)),
        exp.location,
      )
    }

    case "ChainExp": {
      return M.ChainExp(
        exp.steps.map((s) => expNaiveSubst(s, name, rhs)),
        exp.location,
      )
    }

    case "ComposeExp": {
      return M.ComposeExp(
        exp.steps.map((s) => expNaiveSubst(s, name, rhs)),
        exp.location,
      )
    }

    case "Begin1Exp": {
      return M.Begin1Exp(
        expNaiveSubst(exp.head, name, rhs),
        expNaiveSubst(exp.body, name, rhs),
        exp.location,
      )
    }

    case "IfExp": {
      return M.IfExp(
        expNaiveSubst(exp.condition, name, rhs),
        expNaiveSubst(exp.consequent, name, rhs),
        expNaiveSubst(exp.alternative, name, rhs),
        exp.location,
      )
    }

    case "WhenExp": {
      return M.WhenExp(
        expNaiveSubst(exp.condition, name, rhs),
        expNaiveSubst(exp.consequent, name, rhs),
        exp.location,
      )
    }

    case "UnlessExp": {
      return M.UnlessExp(
        expNaiveSubst(exp.condition, name, rhs),
        expNaiveSubst(exp.alternative, name, rhs),
        exp.location,
      )
    }

    case "AndExp": {
      return M.AndExp(
        exp.exps.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "OrExp": {
      return M.OrExp(
        exp.exps.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "CondExp": {
      return M.CondExp(
        exp.clauses.map((clause) => ({
          question: expNaiveSubst(clause.question, name, rhs),
          answer: expNaiveSubst(clause.answer, name, rhs),
          location: clause.location,
        })),
        exp.location,
      )
    }

    case "ListExp": {
      return M.ListExp(
        exp.elements.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "StringConcatExp": {
      return M.StringConcatExp(
        exp.elements.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "SetExp": {
      return M.SetExp(
        exp.elements.map((e) => expNaiveSubst(e, name, rhs)),
        exp.location,
      )
    }

    case "HashExp": {
      return M.HashExp(
        exp.entries.map((entry) => ({
          key: expNaiveSubst(entry.key, name, rhs),
          value: expNaiveSubst(entry.value, name, rhs),
        })),
        exp.location,
      )
    }

    case "ArrowExp": {
      return M.ArrowExp(
        exp.argTypes.map((t) => expNaiveSubst(t, name, rhs)),
        expNaiveSubst(exp.retType, name, rhs),
        exp.location,
      )
    }

    case "TheExp": {
      return M.TheExp(
        expNaiveSubst(exp.type, name, rhs),
        expNaiveSubst(exp.instance, name, rhs),
        exp.location,
      )
    }
  }
}
