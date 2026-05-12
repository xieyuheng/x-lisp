import { range } from "@xieyuheng/helpers.js/range"
import assert from "node:assert"
import * as M from "../index.ts"
import { type Type } from "../index.ts"

export function typeApply(target: Type, args: Array<Type>): Type {
  if (M.isDefinitionType(target)) {
    return applyDefinition(target.definition, args)
  }

  if (M.isCurryType(target)) {
    const allArgs = [...target.args, ...args]
    if (allArgs.length < target.arity) {
      return M.CurryType(target.target, target.arity, allArgs)
    }

    assert(allArgs.length === target.arity)
    const result = typeApply(target.target, allArgs)
    if (args.length > target.arity - target.args.length) {
      const extraArgs = allArgs.slice(target.arity)
      return typeApply(result, extraArgs)
    }

    return result
  }

  let message = `[typeApply] unhandled target`
  message += `\n  target: ${M.formatType(target)}`
  message += `\n  args: ${args.map((a) => M.formatType(a)).join(", ")}`
  throw new Error(message)
}

function applyDefinition(definition: M.Definition, args: Array<Type>): Type {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      const fn = definition.fn as (...args: Array<Type>) => Type
      return fn(...args)
    }

    case "TypeDefinition": {
      const typeEnv = M.typeEnvEmpty()
      for (const i of range(definition.parameters.length)) {
        if (args[i] !== undefined) {
          typeEnv.set(definition.parameters[i], args[i])
        }
      }
      return M.typeEvaluate(definition.mod, typeEnv, definition.body)
    }

    case "AlgebraicTypeDefinition": {
      return M.AlgebraicDataType(definition, args)
    }

    default: {
      let message = `[applyDefinition] unhandled definition kind`
      message += `\n  kind: ${definition.kind}`
      message += `\n  name: ${definition.name}`
      throw new Error(message)
    }
  }
}
