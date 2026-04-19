import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import * as M from "../index.ts"

export function apply(target: M.Value, args: Array<M.Value>): M.Value {
  const arity = getArity(target, args)
  if (arity > args.length) {
    if (target.kind === "CurryValue") {
      // normalize `Curry`
      return M.CurryValue(target.target, arity - args.length, [
        ...target.args,
        ...args,
      ])
    } else {
      return M.CurryValue(target, arity - args.length, args)
    }
  } else if (arity < args.length) {
    return apply(apply(target, args.slice(0, arity)), args.slice(arity))
  }

  switch (target.kind) {
    case "KeywordValue": {
      const [firstArg, ...restArgs] = args
      if (!M.isRecordValue(firstArg)) {
        let message = `[apply] can only keyword to record`
        message += formatUnderTag(2, `target:`, M.formatValue(target))
        message += formatUnderTag(2, `args:`, M.formatValues(args))
        throw new Error(message)
      }

      const attribute = firstArg.attributes[target.content]
      if (attribute === undefined) {
        let message = `[apply] missing attribute in record`
        message += formatUnderTag(2, `target:`, M.formatValue(target))
        message += formatUnderTag(2, `args:`, M.formatValues(args))
        throw new Error(message)
      }

      if (restArgs.length === 0) {
        return attribute
      } else {
        return apply(attribute, restArgs)
      }
    }

    case "CurryValue": {
      return apply(target.target, [...target.args, ...args])
    }

    case "ClosureValue": {
      const newEnv = M.envPutMany(target.env, target.parameters, args)
      return M.evaluate(target.mod, newEnv, target.body)
    }

    case "DefinitionValue": {
      switch (target.definition.kind) {
        case "PrimitiveFunctionDefinition": {
          return target.definition.fn(...args)
        }

        case "FunctionDefinition": {
          return apply(
            M.ClosureValue(
              target.definition.mod,
              M.emptyEnv(),
              target.definition.parameters,
              target.definition.body,
            ),
            args,
          )
        }

        case "TypeDefinition": {
          return apply(
            M.ClosureValue(
              target.definition.mod,
              M.emptyEnv(),
              target.definition.parameters,
              target.definition.body,
            ),
            args,
          )
        }

        case "DataDefinition": {
          return M.createDefinedDataType(target.definition, args)
        }

        case "InterfaceDefinition": {
          return M.createDefinedInterfaceType(target.definition, args)
        }

        default: {
          let message = `[apply] can not handle this kind of definition`
          message += formatUnderTag(2, `target:`, M.formatValue(target))
          message += formatUnderTag(2, `args:`, M.formatValues(args))
          throw new Error(message)
        }
      }
    }

    default: {
      let message = `[apply] can not handle this kind of target`
      message += formatUnderTag(2, `target:`, M.formatValue(target))
      message += formatUnderTag(2, `args:`, M.formatValues(args))
      throw new Error(message)
    }
  }
}

function getArity(target: M.Value, args: Array<M.Value>): number {
  switch (target.kind) {
    case "KeywordValue": {
      return 1
    }

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

        case "TypeDefinition": {
          return target.definition.parameters.length
        }

        case "DataDefinition": {
          return target.definition.dataTypeConstructor.parameters.length
        }

        case "InterfaceDefinition": {
          return target.definition.interfaceConstructor.parameters.length
        }

        default: {
          let message = `[getArity] can not handle this kind of definition`
          message += formatUnderTag(2, `target:`, M.formatValue(target))
          message += formatUnderTag(2, `args:`, M.formatValues(args))
          throw new Error(message)
        }
      }
    }

    case "CurryValue": {
      return target.arity
    }

    default: {
      let message = `[getApply] can not handle this kind of target`
      message += `\n  target kind: ${target.kind}`
      message += formatUnderTag(2, `target:`, M.formatValue(target))
      message += formatUnderTag(2, `args:`, M.formatValues(args))
      throw new Error(message)
    }
  }
}
