import { range } from "@xieyuheng/helpers.js/range"
import assert from "node:assert"
import * as M from "../index.ts"
import { type Value } from "./Value.ts"
import type { EvaluationMode } from "./evaluate.ts"

export function applyValue(
  mode: EvaluationMode,
  target: Value,
  args: Array<Value>,
): Value {
  if (M.isDefinitionValue(target)) {
    return applyDefinition(mode, target.definition, args)
  }

  if (M.isCurryValue(target)) {
    const allArgs = [...target.args, ...args]
    if (allArgs.length < target.arity) {
      return M.CurryValue(target.target, target.arity, allArgs)
    }

    assert(allArgs.length === target.arity)
    const result = M.applyValue(mode, target.target, allArgs)
    if (args.length > target.arity - target.args.length) {
      const extraArgs = allArgs.slice(target.arity)
      return M.applyValue(mode, result, extraArgs)
    }

    return result
  }

  let message = `[applyValue] unhandled target`
  message += `\n  target: ${M.formatValue(target)}`
  message += `\n  args: ${args.map((a) => M.formatValue(a)).join(", ")}`
  throw new Error(message)
}

function applyDefinition(
  mode: EvaluationMode,
  definition: M.Definition,
  args: Array<Value>,
): Value {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      const fn = definition.fn as (...args: Array<M.Type>) => M.Type
      const typeArgs = args.map((arg) => {
        if (!M.isTypeValue(arg)) {
          let message = `[applyDefinition] expected type argument`
          message += `\n  kind: ${arg.kind}`
          throw new Error(message)
        }
        return arg.type
      })
      return M.TypeValue(fn(...typeArgs))
    }

    case "TypeDefinition": {
      let env = M.emptyEnv()
      for (const i of range(definition.parameters.length)) {
        if (args[i] !== undefined) {
          env = M.envPut(env, definition.parameters[i], args[i])
        }
      }
      return M.evaluate(mode, definition.mod, env, definition.body)
    }

    case "AlgebraicTypeDefinition": {
      return M.TypeValue(
        M.AlgebraicType(
          definition,
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
        let env = M.emptyEnv()
        for (const i of range(definition.typeConstructor.parameters.length)) {
          if (args[i] !== undefined) {
            env = M.envPut(
              env,
              definition.typeConstructor.parameters[i],
              args[i],
            )
          }
        }
        return M.evaluate(
          mode,
          definition.mod,
          env,
          definition.representationType,
        )
      } else {
        return M.TypeValue(
          M.OpaqueType(
            definition,
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
    }

    default: {
      let message = `[applyDefinition] unhandled definition kind`
      message += `\n  kind: ${definition.kind}`
      message += `\n  name: ${definition.name}`
      throw new Error(message)
    }
  }
}
