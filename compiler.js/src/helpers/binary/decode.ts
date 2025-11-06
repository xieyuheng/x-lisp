import assert from "node:assert"
import type { Exp } from "./Exp.ts"
import { createState, positionAdvance, type State } from "./State.ts"
import type { Type } from "./Type.ts"

export function decode(buffer: ArrayBuffer, exp: Exp): any {
  const state = createState(buffer, {})
  execute(state, exp)
  return state.data
}

function execute(state: State, exp: Exp): null {
  switch (exp.kind) {
    case "LittleEndian": {
      state.endianStack.push("LittleEndian")
      execute(state, exp.exp)
      state.endianStack.pop()
      return null
    }

    case "BigEndian": {
      state.endianStack.push("BigEndian")
      execute(state, exp.exp)
      state.endianStack.pop()
      return null
    }

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
  const endian = state.endianStack.at(-1)
  assert(endian)
  const LittleEndian = endian === "LittleEndian"
  const position = state.positionStack.at(-1)
  assert(position)

  switch (type.type) {
    case "Int8": {
      state.data[name] = state.view.getInt8(position.byteIndex)
      positionAdvance(position, 1)
      return null
    }

    case "Int16": {
      state.data[name] = state.view.getInt16(position.byteIndex, LittleEndian)
      positionAdvance(position, 2)
      return null
    }

    case "Int32": {
      state.data[name] = state.view.getInt32(position.byteIndex, LittleEndian)
      positionAdvance(position, 4)
      return null
    }

    case "BigInt64": {
      state.data[name] = state.view.getBigInt64(
        position.byteIndex,
        LittleEndian,
      )
      positionAdvance(position, 8)
      return null
    }

    case "Uint8": {
      state.data[name] = state.view.getUint8(position.byteIndex)
      positionAdvance(position, 1)
      return null
    }

    case "Uint16": {
      state.data[name] = state.view.getUint16(position.byteIndex, LittleEndian)
      positionAdvance(position, 2)
      return null
    }

    case "Uint32": {
      state.data[name] = state.view.getUint32(position.byteIndex, LittleEndian)
      positionAdvance(position, 4)
      return null
    }

    case "BigUint64": {
      state.data[name] = state.view.getBigUint64(
        position.byteIndex,
        LittleEndian,
      )
      positionAdvance(position, 8)
      return null
    }

    case "Float16": {
      state.data[name] = state.view.getFloat16(position.byteIndex, LittleEndian)
      positionAdvance(position, 2)
      return null
    }

    case "Float32": {
      state.data[name] = state.view.getFloat32(position.byteIndex, LittleEndian)
      positionAdvance(position, 4)
      return null
    }

    case "Float64": {
      state.data[name] = state.view.getFloat64(position.byteIndex, LittleEndian)
      positionAdvance(position, 8)
      return null
    }
  }
}
