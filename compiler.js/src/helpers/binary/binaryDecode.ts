import type { Exp } from "./Exp.ts"
import { createState, type State } from "./State.ts"
import type { Type } from "./Type.ts"

export function binaryDecode(buffer: ArrayBuffer, exp: Exp): any {
  const state = createState(buffer, {})
  execute(state, exp)
  return state.data
}

function execute(state: State, exp: Exp): null {
  switch (exp.kind) {
    case "Sequence": {
      for (const childExp of exp.exps) {
        execute(state, childExp)
      }

      return null
    }

    case "Attribute": {
      executeAttribute(state, exp.name, exp.type)
      return null
    }

    case "Dependent": {
      execute(state, exp.fn(state.data))
      return null
    }
  }
}

function executeAttribute(state: State, name: string, type: Type): null {
  switch (type.type) {
    case "Int8": {
      state.data[name] = state.view.getInt8(state.index)
      state.index += 1
      return null
    }

    case "Int16": {
      state.data[name] = state.view.getInt16(state.index, true)
      state.index += 2
      return null
    }

    case "Int32": {
      state.data[name] = state.view.getInt32(state.index, true)
      state.index += 4
      return null
    }

    case "BigInt64": {
      state.data[name] = state.view.getBigInt64(state.index, true)
      state.index += 8
      return null
    }

    case "Uint8": {
      state.data[name] = state.view.getUint8(state.index)
      state.index += 1
      return null
    }

    case "Uint16": {
      state.data[name] = state.view.getUint16(state.index, true)
      state.index += 2
      return null
    }

    case "Uint32": {
      state.data[name] = state.view.getUint32(state.index, true)
      state.index += 4
      return null
    }

    case "BigUint64": {
      state.data[name] = state.view.getBigUint64(state.index, true)
      state.index += 8
      return null
    }

    case "Float16": {
      state.data[name] = state.view.getFloat16(state.index, true)
      state.index += 2
      return null
    }

    case "Float32": {
      state.data[name] = state.view.getFloat32(state.index, true)
      state.index += 4
      return null
    }

    case "Float64": {
      state.data[name] = state.view.getFloat64(state.index, true)
      state.index += 8
      return null
    }
  }
}
