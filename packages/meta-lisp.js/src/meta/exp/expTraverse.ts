import * as M from "../index.ts"
import type { Exp } from "./Exp.ts"

export function expTraverse(onExp: (exp: Exp) => Exp, exp: Exp): Exp {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp":
    case "VarExp":
    case "QualifiedVarExp": {
      return exp
    }

    case "QuoteExp":
    case "SexpExp":
    case "CommentExp": {
      return exp
    }

    case "LambdaExp": {
      return M.LambdaExp(exp.parameters, onExp(exp.body), exp.location)
    }

    case "PolymorphicExp": {
      return M.PolymorphicExp(exp.parameters, onExp(exp.body), exp.location)
    }

    case "ApplyExp": {
      return M.ApplyExp(
        onExp(exp.target),
        exp.args.map((e) => onExp(e)),
        exp.location,
      )
    }

    case "PipeExp": {
      return M.PipeExp(
        onExp(exp.target),
        exp.steps.map((e) => onExp(e)),
        exp.location,
      )
    }

    case "ChainExp": {
      return M.ChainExp(
        exp.steps.map((e) => onExp(e)),
        exp.location,
      )
    }

    case "ComposeExp": {
      return M.ComposeExp(
        exp.steps.map((e) => onExp(e)),
        exp.location,
      )
    }

    case "Let1Exp": {
      return M.Let1Exp(exp.name, onExp(exp.rhs), onExp(exp.body), exp.location)
    }

    case "LetExp": {
      return M.LetExp(
        exp.bindings.map((binding) =>
          M.Binding(binding.name, onExp(binding.rhs), binding.location),
        ),
        onExp(exp.body),
        exp.location,
      )
    }

    case "LetStarExp": {
      return M.LetStarExp(
        exp.bindings.map((binding) =>
          M.Binding(binding.name, onExp(binding.rhs), binding.location),
        ),
        onExp(exp.body),
        exp.location,
      )
    }

    case "LetrecExp": {
      return M.LetrecExp(
        exp.bindings.map((binding) =>
          M.Binding(binding.name, onExp(binding.rhs), binding.location),
        ),
        onExp(exp.body),
        exp.location,
      )
    }

    case "LocalDefineExp": {
      return M.LocalDefineExp(
        exp.name,
        exp.parameters,
        onExp(exp.body),
        exp.location,
      )
    }

    case "LetrecStarExp": {
      return M.LetrecStarExp(
        exp.bindings.map((binding) =>
          M.Binding(binding.name, onExp(binding.rhs), binding.location),
        ),
        onExp(exp.body),
        exp.location,
      )
    }

    case "Begin1Exp": {
      return M.Begin1Exp(onExp(exp.head), onExp(exp.body), exp.location)
    }

    case "BeginExp": {
      return M.BeginExp(exp.sequence.map(onExp), exp.location)
    }

    case "WhenExp": {
      return M.WhenExp(
        onExp(exp.condition),
        onExp(exp.consequent),
        exp.location,
      )
    }

    case "UnlessExp": {
      return M.UnlessExp(
        onExp(exp.condition),
        onExp(exp.alternative),
        exp.location,
      )
    }

    case "AndExp": {
      return M.AndExp(exp.exps.map(onExp), exp.location)
    }

    case "OrExp": {
      return M.OrExp(exp.exps.map(onExp), exp.location)
    }

    case "CondExp": {
      return M.CondExp(
        exp.clauses.map((clause) => ({
          question: onExp(clause.question),
          answer: onExp(clause.answer),
          location: clause.location,
        })),
        exp.location,
      )
    }

    case "IfExp": {
      return M.IfExp(
        onExp(exp.condition),
        onExp(exp.consequent),
        onExp(exp.alternative),
        exp.location,
      )
    }

    case "ListExp": {
      return M.ListExp(exp.elements.map(onExp), exp.location)
    }

    case "StringConcatExp": {
      return M.StringConcatExp(exp.elements.map(onExp), exp.location)
    }

    case "SetExp": {
      return M.SetExp(exp.elements.map(onExp), exp.location)
    }

    case "HashExp": {
      return M.HashExp(
        exp.entries.map((entry) => ({
          key: onExp(entry.key),
          value: onExp(entry.value),
        })),
        exp.location,
      )
    }

    case "ArrowExp": {
      return M.ArrowExp(
        exp.argTypes.map(onExp),
        onExp(exp.retType),
        exp.location,
      )
    }

    case "TheExp": {
      return M.TheExp(onExp(exp.type), onExp(exp.instance), exp.location)
    }

    case "MatchExp": {
      return M.MatchExp(
        exp.targets.map(onExp),
        exp.clauses.map((clause) =>
          M.MatchClause(
            clause.patterns.map(onExp),
            onExp(clause.body),
            clause.location,
          ),
        ),
        exp.location,
      )
    }
  }
}
