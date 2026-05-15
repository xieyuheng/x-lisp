import { range } from "@xieyuheng/helpers.js/range"
import assert from "node:assert"
import * as M from "../index.ts"
import { type Type } from "../index.ts"
import type { OpaqueMode } from "./typeEvaluate.ts"

export function typeApply(
  target: Type,
  args: Array<Type>,
  opaqueMode: OpaqueMode = "opaque",
): Type {
  if (M.isDefinitionType(target)) {
    return applyDefinition(target.definition, args, opaqueMode)
  }

  if (M.isCurryType(target)) {
    const allArgs = [...target.args, ...args]
    if (allArgs.length < target.arity) {
      return M.CurryType(target.target, target.arity, allArgs)
    }

    assert(allArgs.length === target.arity)
    const result = typeApply(target.target, allArgs, opaqueMode)
    if (args.length > target.arity - target.args.length) {
      const extraArgs = allArgs.slice(target.arity)
      return typeApply(result, extraArgs, opaqueMode)
    }

    return result
  }

  let message = `[typeApply] unhandled target`
  message += `\n  target: ${M.formatType(target)}`
  message += `\n  args: ${args.map((a) => M.formatType(a)).join(", ")}`
  throw new Error(message)
}

function applyDefinition(
  definition: M.Definition,
  args: Array<Type>,
  opaqueMode: OpaqueMode,
): Type {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      const fn = definition.fn as (...args: Array<Type>) => Type
      return fn(...args)
    }

    case "TypeDefinition": {
      const typeEnv = M.emptyTypeEnv()
      for (const i of range(definition.parameters.length)) {
        if (args[i] !== undefined) {
          typeEnv.set(definition.parameters[i], args[i])
        }
      }
      return M.typeEvaluate(
        definition.mod,
        typeEnv,
        definition.body,
        opaqueMode,
      )
    }

    case "AlgebraicTypeDefinition": {
      return M.AlgebraicType(definition, args)
    }

    case "OpaqueTypeDefinition": {
      if (opaqueMode === "transparent") {
        const typeEnv = M.emptyTypeEnv()
        for (const i of range(definition.typeConstructor.parameters.length)) {
          if (args[i] !== undefined) {
            typeEnv.set(definition.typeConstructor.parameters[i], args[i])
          }
        }
        return M.typeEvaluate(
          definition.mod,
          typeEnv,
          definition.representationType,
          opaqueMode,
        )
      } else {
        return M.OpaqueType(definition, args)
      }
    }

    default: {
      let message = `[applyDefinition] unhandled definition kind`
      message += `\n  kind: ${definition.kind}`
      message += `\n  name: ${definition.name}`
      throw new Error(message)
    }
  }
}
