import { setAdd, setUnion, setUnionMany } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

export function expFreeNames(boundNames: Set<string>, exp: M.Exp): Set<string> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "QualifiedVar":
    case "Quote": {
      return new Set()
    }

    case "Var": {
      if (boundNames.has(exp.name)) {
        return new Set()
      } else {
        return new Set([exp.name])
      }
    }

    case "Lambda": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return expFreeNames(newBoundNames, exp.body)
    }

    case "Polymorphic": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return expFreeNames(newBoundNames, exp.body)
    }

    case "Let1": {
      const newBoundNames = setAdd(boundNames, exp.name)
      return setUnionMany([
        expFreeNames(boundNames, exp.rhs),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "Let": {
      const allNames = exp.bindings.map((b) => b.name)
      const newBoundNames = setUnion(boundNames, new Set(allNames))
      return setUnionMany([
        ...exp.bindings.map((b) => expFreeNames(boundNames, b.rhs)),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "LetStar": {
      let newBoundNames = boundNames
      const rhses = exp.bindings.map((b) => {
        const result = expFreeNames(newBoundNames, b.rhs)
        newBoundNames = setAdd(newBoundNames, b.name)
        return result
      })
      return setUnionMany([...rhses, expFreeNames(newBoundNames, exp.body)])
    }

    case "Letrec": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const newBoundNames = setUnion(boundNames, allNames)
      return setUnionMany([
        ...exp.bindings.map((b) => expFreeNames(newBoundNames, b.rhs)),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "LocalDefine": {
      const newBoundNames = setAdd(boundNames, exp.name)
      return expFreeNames(newBoundNames, exp.body)
    }

    case "LetrecStar": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const newBoundNames = setUnion(boundNames, allNames)
      return setUnionMany([
        ...exp.bindings.map((b) => expFreeNames(newBoundNames, b.rhs)),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "Apply": {
      const children = [exp.target, ...exp.args]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "Pipe": {
      const children = [exp.target, ...exp.steps]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "Chain": {
      return setUnionMany(exp.steps.map((e) => expFreeNames(boundNames, e)))
    }

    case "Compose": {
      return setUnionMany(exp.steps.map((e) => expFreeNames(boundNames, e)))
    }

    case "Begin1": {
      return setUnionMany([
        expFreeNames(boundNames, exp.head),
        expFreeNames(boundNames, exp.body),
      ])
    }

    case "Begin": {
      return setUnionMany(exp.sequence.map((e) => expFreeNames(boundNames, e)))
    }

    case "Assign": {
      return expFreeNames(boundNames, exp.rhs)
    }

    case "If": {
      return setUnionMany([
        expFreeNames(boundNames, exp.condition),
        expFreeNames(boundNames, exp.consequent),
        expFreeNames(boundNames, exp.alternative),
      ])
    }

    case "When": {
      return setUnionMany([
        expFreeNames(boundNames, exp.condition),
        expFreeNames(boundNames, exp.consequent),
      ])
    }

    case "Unless": {
      return setUnionMany([
        expFreeNames(boundNames, exp.condition),
        expFreeNames(boundNames, exp.alternative),
      ])
    }

    case "And": {
      return setUnionMany(exp.exps.map((e) => expFreeNames(boundNames, e)))
    }

    case "Or": {
      return setUnionMany(exp.exps.map((e) => expFreeNames(boundNames, e)))
    }

    case "Cond": {
      return setUnionMany(
        exp.clauses.flatMap((clause) => [
          expFreeNames(boundNames, clause.question),
          expFreeNames(boundNames, clause.answer),
        ]),
      )
    }

    case "LiteralList": {
      return setUnionMany(exp.elements.map((e) => expFreeNames(boundNames, e)))
    }

    case "LiteralSet": {
      return setUnionMany(exp.elements.map((e) => expFreeNames(boundNames, e)))
    }

    case "LiteralHash": {
      return setUnionMany(
        exp.entries.flatMap((entry) => [
          expFreeNames(boundNames, entry.key),
          expFreeNames(boundNames, entry.value),
        ]),
      )
    }

    case "Arrow": {
      return setUnionMany([
        ...exp.argTypes.map((t) => expFreeNames(boundNames, t)),
        expFreeNames(boundNames, exp.retType),
      ])
    }

    case "The": {
      return setUnionMany([
        expFreeNames(boundNames, exp.type),
        expFreeNames(boundNames, exp.exp),
      ])
    }

    case "Match": {
      return setUnionMany([
        setUnionMany(exp.targets.map((t) => expFreeNames(boundNames, t))),
        setUnionMany(
          exp.clauses.map((clause) => {
            const clauseBoundNames = setUnionMany(
              clause.patterns.map(M.patternBoundNames),
            )
            const newBoundNames = setUnion(boundNames, clauseBoundNames)
            return expFreeNames(newBoundNames, clause.body)
          }),
        ),
      ])
    }
  }
}
