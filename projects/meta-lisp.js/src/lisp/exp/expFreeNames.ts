import { setAdd, setUnion, setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { type Exp } from "./Exp.ts"

export function expFreeNames(boundNames: Set<string>, exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Var":
    case "Require": {
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

    case "Begin1": {
      const children = [exp.head, exp.body]
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "AssignSugar": {
      let message = `[expFreeNames] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "BeginSugar": {
      return expFreeNames(boundNames, L.desugarBegin(exp.sequence))
    }

    case "Apply": {
      const children = [exp.target, ...exp.args]
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "When": {
      const children = [exp.condition, exp.consequent]
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Unless": {
      const children = [exp.condition, exp.alternative]
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "And": {
      const children = exp.exps
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Or": {
      const children = exp.exps
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "If": {
      const children = [exp.condition, exp.consequent, exp.alternative]
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Cond": {
      const children = exp.condLines.flatMap((condLine) => [
        condLine.question,
        condLine.answer,
      ])
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Quote": {
      return new Set()
    }

    case "List": {
      const children = exp.elements
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Tuple": {
      const children = exp.elements
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Object": {
      const children = Object.values(exp.attributes)
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Set": {
      const children = exp.elements
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Hash": {
      const children = exp.entries.flatMap((entry) => [entry.key, entry.value])
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Arrow": {
      const children = [...exp.argTypes, exp.retType]
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Tau": {
      const children = exp.elementTypes
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "Class": {
      const children = Object.values(exp.attributeTypes)
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }

    case "The": {
      const children = [exp.type, exp.exp]
      return setUnionMany(
        children.map((child) => expFreeNames(boundNames, child)),
      )
    }
  }
}
