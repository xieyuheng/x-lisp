import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import * as L from "../index.ts"

export function apply(target: L.Value, args: Array<L.Value>): L.Value {
  const arity = getArity(target)
  if (arity > args.length) {
    if (target.kind === "CurryValue") {
      // normalize `Curry`
      return L.CurryValue(target.target, arity - args.length, [
        ...target.args,
        ...args,
      ])
    } else {
      return L.CurryValue(target, arity - args.length, args)
    }
  } else if (arity < args.length) {
    return apply(apply(target, args.slice(0, arity)), args.slice(arity))
  }

  switch (target.kind) {
    case "CurryValue": {
      return apply(target.target, [...target.args, ...args])
    }

    case "ClosureValue": {
      const newEnv = L.envPutMany(target.env, target.parameters, args)
      return L.evaluate(target.mod, newEnv, target.body)
    }

    case "DefinitionValue": {
      switch (target.definition.kind) {
        case "PrimitiveFunctionDefinition": {
          return target.definition.fn(...args)
        }

        case "FunctionDefinition": {
          return apply(
            L.ClosureValue(
              target.definition.mod,
              L.emptyEnv(),
              target.definition.parameters,
              target.definition.body,
            ),
            args,
          )
        }

        case "DatatypeDefinition": {
          return L.createDatatypeType(target.definition, args)
        }

        default: {
          let message = `[apply] can not handle this kind of definition`
          message += formatUnderTag(2, `target:`, L.formatValue(target))
          message += formatUnderTag(2, `args:`, L.formatValues(args))
          throw new Error(message)
        }
      }
    }

    default: {
      let message = `[apply] can not handle this kind of target`
      message += formatUnderTag(2, `target:`, L.formatValue(target))
      message += formatUnderTag(2, `args:`, L.formatValues(args))
      throw new Error(message)
    }
  }
}

function getArity(target: L.Value): number {
  switch (target.kind) {
    case "ClosureValue": {
      return target.parameters.length
    }

    case "DefinitionValue": {
      switch (target.definition.kind) {
        case "PrimitiveFunctionDefinition": {
          return target.definition.arity
        }

        case "FunctionDefinition": {
          return target.definition.parameters.length
        }

        case "DatatypeDefinition": {
          return target.definition.datatypeConstructor.parameters.length
        }

        default: {
          let message = `[getArity] can not handle this kind of definition`
          message += formatUnderTag(2, `target:`, L.formatValue(target))
          throw new Error(message)
        }
      }
    }

    case "CurryValue": {
      return target.arity
    }

    default: {
      let message = `[getApply] can not handle this kind of target`
      message += formatUnderTag(2, `target:`, L.formatValue(target))
      throw new Error(message)
    }
  }
}
