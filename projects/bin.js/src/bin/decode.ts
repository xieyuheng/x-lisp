import type { Exp } from "./Exp.ts"
import { Position } from "./index.ts"
import { type Data, State } from "./State.ts"
import type { Type } from "./Type.ts"

export function decode(buffer: ArrayBuffer, exp: Exp): Data {
  const view = new DataView(buffer)
  const state = new State(buffer, view, {})
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

    case "Magic": {
      const byte = state.getInt8()
      if (byte !== exp.byte) {
        let message = `[decode/execute] wrong magic byte`
        message += `\n  expected byte: 0x${exp.byte.toString(16)}`
        message += `\n  byte: 0x${byte.toString(16)}`
        message += `\n  index: ${state.currentPosition().byteIndex}`
        throw new Error(message)
      }

      return null
    }

    case "Padding": {
      let count = 0
      while (count < exp.value) {
        state.getInt8()
        count++
      }

      return null
    }

    case "Offset": {
      const newPosition = new Position(exp.value)
      state.positionStack.push(newPosition)
      execute(state, exp.exp)
      state.positionStack.pop()
      return null
    }
  }
}

function executeAttribute(state: State, name: string, type: Type): void {
  state.data[name] = executeType(state, type)
}

function executeType(state: State, type: Type): any {
  switch (type.kind) {
    case "Int8": {
      return state.getInt8()
    }

    case "Int16": {
      return state.getInt16()
    }

    case "Int32": {
      return state.getInt32()
    }

    case "Int64": {
      return state.getInt64()
    }

    case "BigInt64": {
      return state.getBigInt64()
    }

    case "Uint8": {
      return state.getUint8()
    }

    case "Uint16": {
      return state.getUint16()
    }

    case "Uint32": {
      return state.getUint32()
    }

    case "Uint64": {
      return state.getUint64()
    }

    case "BigUint64": {
      return state.getBigUint64()
    }

    case "Float16": {
      return state.getFloat16()
    }

    case "Float32": {
      return state.getFloat32()
    }

    case "Float64": {
      return state.getFloat64()
    }

    case "Array": {
      const results: Array<Data> = []
      let count = 0
      while (count < type.elementCount) {
        const position = state.currentPosition()
        const offset = position.byteIndex + count * type.elementSize
        const view = new DataView(state.buffer, offset, type.elementSize)
        const elementState = new State(state.buffer, view, {})
        elementState.endianStack.push(state.currentEndian())
        execute(elementState, type.exp)
        results.push(elementState.data)
        count++
      }

      return results
    }
  }
}
