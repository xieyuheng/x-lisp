import { range } from "@xieyuheng/helpers.js/range"
import assert from "node:assert"
import * as M from "../index.ts"
import type { EvaluationMode } from "./Env.ts"

export function apply(
  mode: EvaluationMode,
  target: M.Value,
  args: Array<M.Value>,
): M.Value {
  if (M.isDefinitionValue(target)) {
    return applyDefinition(mode, target.definition, args)
  }

  if (M.isCurryValue(target)) {
    const allArgs = [...target.args, ...args]
    if (allArgs.length < target.arity) {
      return M.CurryValue(target.target, target.arity, allArgs)
    }

    assert(allArgs.length === target.arity)
    const result = M.apply(mode, target.target, allArgs)
    if (args.length > target.arity - target.args.length) {
      const extraArgs = allArgs.slice(target.arity)
      return M.apply(mode, result, extraArgs)
    }

    return result
  }

  let message = `[apply] unhandled target`
  message += `\n  target: ${M.formatValue(target)}`
  message += `\n  args: ${args.map((a) => M.formatValue(a)).join(", ")}`
  throw new Error(message)
}

function applyDefinition(
  mode: EvaluationMode,
  definition: M.Definition,
  args: Array<M.Value>,
): M.Value {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      return definition.fn(...args)
    }

    case "TypeDefinition": {
      let env = M.emptyEnv(mode)
      for (const i of range(definition.parameters.length)) {
        if (args[i] !== undefined) {
          env = M.envPut(env, definition.parameters[i], args[i])
        }
      }
      return M.evaluate(definition.mod, env, definition.body)
    }

    case "AlgebraicTypeDefinition": {
      return M.TypeValue(
        M.DataType(
          definition.typeConstructor,
          args.map((arg) => {
            if (!M.isTypeValue(arg)) {
              let message = `[applyDefinition] expected type argument`
              message += `\n  kind: ${arg.kind}`
              throw new Error(message)
            }
            return arg.type
          }),
        ),
      )
    }

    case "OpaqueTypeDefinition": {
      if (mode === "TransparentMode") {
        let env = M.emptyEnv(mode)
        for (const i of range(definition.typeConstructor.parameters.length)) {
          if (args[i] !== undefined) {
            env = M.envPut(
              env,
              definition.typeConstructor.parameters[i],
              args[i],
            )
          }
        }

        return M.evaluate(definition.mod, env, definition.representationType)
      }

      return M.TypeValue(
        M.DataType(
          definition.typeConstructor,
          args.map((arg) => {
            if (!M.isTypeValue(arg)) {
              let message = `[applyDefinition] expected type argument`
              message += `\n  kind: ${arg.kind}`
              throw new Error(message)
            }
            return arg.type
          }),
        ),
      )
    }

    default: {
      let message = `[applyDefinition] unhandled definition kind`
      message += `\n  kind: ${definition.kind}`
      message += `\n  name: ${definition.name}`
      throw new Error(message)
    }
  }
}
