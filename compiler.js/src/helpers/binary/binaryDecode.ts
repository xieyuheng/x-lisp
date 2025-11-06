import { createContext, type Context } from "./Context.ts"
import type { Exp } from "./Exp.ts"
import type { Type } from "./Type.ts"

export function binaryDecode(buffer: ArrayBuffer, exp: Exp): any {
  const context = createContext(buffer, {})
  execute(context, exp)
  return context.data
}

function execute(context: Context, exp: Exp): null {
  switch (exp.kind) {
    case "SequenceExp": {
      for (const childExp of exp.exps) {
        execute(context, childExp)
      }

      return null
    }

    case "AttributeExp": {
      executeAttribute(context, exp.name, exp.type)
      return null
    }

    case "DependentExp": {
      execute(context, exp.fn(context.data))
      return null
    }
  }
}

function executeAttribute(context: Context, name: string, type: Type): null {
  switch (type.type) {
    case "Int8": {
      context.data[name] = context.view.getInt8(context.index)
      context.index += 1
      return null
    }

    case "Int16": {
      context.data[name] = context.view.getInt16(context.index, true)
      context.index += 2
      return null
    }

    case "Int32": {
      context.data[name] = context.view.getInt32(context.index, true)
      context.index += 4
      return null
    }

    case "BigInt64": {
      context.data[name] = context.view.getBigInt64(context.index, true)
      context.index += 8
      return null
    }

    case "Uint8": {
      context.data[name] = context.view.getUint8(context.index)
      context.index += 1
      return null
    }

    case "Uint16": {
      context.data[name] = context.view.getUint16(context.index, true)
      context.index += 2
      return null
    }

    case "Uint32": {
      context.data[name] = context.view.getUint32(context.index, true)
      context.index += 4
      return null
    }

    case "BigUint64": {
      context.data[name] = context.view.getBigUint64(context.index, true)
      context.index += 8
      return null
    }

    case "Float16": {
      context.data[name] = context.view.getFloat16(context.index, true)
      context.index += 2
      return null
    }

    case "Float32": {
      context.data[name] = context.view.getFloat32(context.index, true)
      context.index += 4
      return null
    }

    case "Float64": {
      context.data[name] = context.view.getFloat64(context.index, true)
      context.index += 8
      return null
    }
  }
}
