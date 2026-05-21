import { setAdd, setUnion, setUnionMany } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

export function expFreeNames(boundNames: Set<string>, exp: M.Exp): Set<string> {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp":
    case "QualifiedVarExp":
    case "QuoteExp": {
      return new Set()
    }

    case "VarExp": {
      if (boundNames.has(exp.name)) {
        return new Set()
      } else {
        return new Set([exp.name])
      }
    }

    case "LambdaExp": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return expFreeNames(newBoundNames, exp.body)
    }

    case "PolymorphicExp": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return expFreeNames(newBoundNames, exp.body)
    }

    case "Let1Exp": {
      const newBoundNames = setAdd(boundNames, exp.name)
      return setUnionMany([
        expFreeNames(boundNames, exp.rhs),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "LetExp": {
      const allNames = exp.bindings.map((b) => b.name)
      const newBoundNames = setUnion(boundNames, new Set(allNames))
      return setUnionMany([
        ...exp.bindings.map((b) => expFreeNames(boundNames, b.rhs)),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "LetStarExp": {
      let newBoundNames = boundNames
      const rhses = exp.bindings.map((b) => {
        const result = expFreeNames(newBoundNames, b.rhs)
        newBoundNames = setAdd(newBoundNames, b.name)
        return result
      })
      return setUnionMany([...rhses, expFreeNames(newBoundNames, exp.body)])
    }

    case "LetrecExp": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const newBoundNames = setUnion(boundNames, allNames)
      return setUnionMany([
        ...exp.bindings.map((b) => expFreeNames(newBoundNames, b.rhs)),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "LocalDefineExp": {
      const newBoundNames = setAdd(boundNames, exp.name)
      return expFreeNames(newBoundNames, exp.body)
    }

    case "LetrecStarExp": {
      const allNames = new Set(exp.bindings.map((b) => b.name))
      const newBoundNames = setUnion(boundNames, allNames)
      return setUnionMany([
        ...exp.bindings.map((b) => expFreeNames(newBoundNames, b.rhs)),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "ApplyExp": {
      const children = [exp.target, ...exp.args]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "PipeExp": {
      const children = [exp.target, ...exp.steps]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "ChainExp": {
      return setUnionMany(exp.steps.map((e) => expFreeNames(boundNames, e)))
    }

    case "ComposeExp": {
      return setUnionMany(exp.steps.map((e) => expFreeNames(boundNames, e)))
    }

    case "Begin1Exp": {
      return setUnionMany([
        expFreeNames(boundNames, exp.head),
        expFreeNames(boundNames, exp.body),
      ])
    }

    case "BeginExp": {
      let currentBoundNames = boundNames
      const freeNamesSets: Array<Set<string>> = []
      for (const e of exp.sequence) {
        if (e.kind === "AssignExp") {
          freeNamesSets.push(expFreeNames(currentBoundNames, e.rhs))
          currentBoundNames = setAdd(currentBoundNames, e.name)
        } else if (e.kind === "LocalDefineExp") {
          const newBoundNames = setAdd(currentBoundNames, e.name)
          freeNamesSets.push(expFreeNames(newBoundNames, e.body))
          currentBoundNames = newBoundNames
        } else {
          freeNamesSets.push(expFreeNames(currentBoundNames, e))
        }
      }
      return setUnionMany(freeNamesSets)
    }

    case "AssignExp": {
      return expFreeNames(boundNames, exp.rhs)
    }

    case "IfExp": {
      return setUnionMany([
        expFreeNames(boundNames, exp.condition),
        expFreeNames(boundNames, exp.consequent),
        expFreeNames(boundNames, exp.alternative),
      ])
    }

    case "WhenExp": {
      return setUnionMany([
        expFreeNames(boundNames, exp.condition),
        expFreeNames(boundNames, exp.consequent),
      ])
    }

    case "UnlessExp": {
      return setUnionMany([
        expFreeNames(boundNames, exp.condition),
        expFreeNames(boundNames, exp.alternative),
      ])
    }

    case "AndExp": {
      return setUnionMany(exp.exps.map((e) => expFreeNames(boundNames, e)))
    }

    case "OrExp": {
      return setUnionMany(exp.exps.map((e) => expFreeNames(boundNames, e)))
    }

    case "CondExp": {
      return setUnionMany(
        exp.clauses.flatMap((clause) => [
          expFreeNames(boundNames, clause.question),
          expFreeNames(boundNames, clause.answer),
        ]),
      )
    }

    case "ListExp": {
      return setUnionMany(exp.elements.map((e) => expFreeNames(boundNames, e)))
    }

    case "SetExp": {
      return setUnionMany(exp.elements.map((e) => expFreeNames(boundNames, e)))
    }

    case "HashExp": {
      return setUnionMany(
        exp.entries.flatMap((entry) => [
          expFreeNames(boundNames, entry.key),
          expFreeNames(boundNames, entry.value),
        ]),
      )
    }

    case "ArrowExp": {
      return setUnionMany([
        ...exp.argTypes.map((t) => expFreeNames(boundNames, t)),
        expFreeNames(boundNames, exp.retType),
      ])
    }

    case "TheExp": {
      return setUnionMany([
        expFreeNames(boundNames, exp.type),
        expFreeNames(boundNames, exp.exp),
      ])
    }

    case "MatchExp": {
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
