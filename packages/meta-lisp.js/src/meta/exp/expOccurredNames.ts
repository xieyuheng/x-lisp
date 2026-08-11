import { setUnion, setUnionMany } from "@xieyuheng/std.js/set"
import * as M from "../index.ts"

export function expOccurredNames(exp: M.Exp): Set<string> {
  switch (exp.kind) {
    case "SymbolExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp":
    case "QualifiedVarExp":
    case "QuoteExp":
    case "SexpExp":
    case "CommentExp": {
      return new Set()
    }

    case "VarExp": {
      return new Set([exp.name])
    }

    case "LambdaExp": {
      return setUnionMany([new Set(exp.parameters), expOccurredNames(exp.body)])
    }

    case "AllExp": {
      return setUnionMany([new Set(exp.parameters), expOccurredNames(exp.body)])
    }

    case "Let1Exp": {
      return setUnionMany([
        new Set([exp.name]),
        expOccurredNames(exp.rhs),
        expOccurredNames(exp.body),
      ])
    }

    case "LetExp": {
      return setUnion(
        setUnionMany(exp.bindings.map(bindingOccurredNames)),
        expOccurredNames(exp.body),
      )
    }

    case "LetrecExp": {
      return setUnion(
        setUnionMany(exp.bindings.map(bindingOccurredNames)),
        expOccurredNames(exp.body),
      )
    }

    case "LocalDefineExp": {
      return setUnion(
        new Set([exp.name, ...exp.parameters]),
        expOccurredNames(exp.body),
      )
    }

    case "ApplyExp": {
      return setUnion(
        expOccurredNames(exp.target),
        setUnionMany(exp.args.map(expOccurredNames)),
      )
    }

    case "FlowExp": {
      return setUnion(
        expOccurredNames(exp.target),
        setUnionMany(exp.steps.map(expOccurredNames)),
      )
    }

    case "ChainExp": {
      return setUnionMany(exp.steps.map((s) => expOccurredNames(s)))
    }

    case "ComposeExp": {
      return setUnionMany(exp.steps.map((s) => expOccurredNames(s)))
    }

    case "Begin1Exp": {
      return setUnion(expOccurredNames(exp.head), expOccurredNames(exp.body))
    }

    case "BeginExp": {
      return setUnionMany(exp.sequence.map((e) => expOccurredNames(e)))
    }

    case "IfExp": {
      return setUnionMany([
        expOccurredNames(exp.condition),
        expOccurredNames(exp.consequent),
        expOccurredNames(exp.alternative),
      ])
    }

    case "WhenExp": {
      return setUnion(
        expOccurredNames(exp.condition),
        expOccurredNames(exp.consequent),
      )
    }

    case "UnlessExp": {
      return setUnion(
        expOccurredNames(exp.condition),
        expOccurredNames(exp.alternative),
      )
    }

    case "AndExp": {
      return setUnionMany(exp.exps.map((e) => expOccurredNames(e)))
    }

    case "OrExp": {
      return setUnionMany(exp.exps.map((e) => expOccurredNames(e)))
    }

    case "CondExp": {
      return setUnionMany(
        exp.clauses.flatMap((clause) => [
          expOccurredNames(clause.question),
          expOccurredNames(clause.answer),
        ]),
      )
    }

    case "ListExp": {
      return setUnionMany(exp.elements.map((e) => expOccurredNames(e)))
    }

    case "TextConcatExp": {
      return setUnionMany(exp.elements.map((e) => expOccurredNames(e)))
    }

    case "SetExp": {
      return setUnionMany(exp.elements.map((e) => expOccurredNames(e)))
    }

    case "HashExp": {
      return setUnionMany(
        exp.entries.flatMap((entry) => [
          expOccurredNames(entry.key),
          expOccurredNames(entry.value),
        ]),
      )
    }

    case "ArrowExp": {
      return setUnionMany([
        ...exp.argTypes.map((t) => expOccurredNames(t)),
        expOccurredNames(exp.retType),
      ])
    }

    case "TheExp": {
      return setUnion(
        expOccurredNames(exp.type),
        expOccurredNames(exp.instance),
      )
    }

    case "MatchExp": {
      return setUnionMany([
        ...exp.targets.map((t) => expOccurredNames(t)),
        ...exp.clauses.flatMap((clause) => [
          ...clause.patterns.map((p) => expOccurredNames(p)),
          expOccurredNames(clause.body),
        ]),
      ])
    }
  }
}

export function bindingOccurredNames(binding: M.Binding): Set<string> {
  return setUnion(new Set(binding.name), expOccurredNames(binding.rhs))
}
