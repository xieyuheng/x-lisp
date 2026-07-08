import {
  AtomType,
  HashType,
  ListType,
  SetType,
  TypeType,
} from "./type/index.ts"
import { type Value, TypeValue, asTypeValue } from "./value/index.ts"

export type TypeFunction = (...args: Array<Value>) => Value

const globalPrimitiveFunctions = new Map<string, TypeFunction>()
const globalPrimitiveVariables = new Map<string, Value>()
let initialized = false

export function setupPrimitive(): void {
  if (initialized) return
  initialized = true

  definePrimitiveVariable("type-t", TypeValue(TypeType()))
  definePrimitiveVariable("int-t", TypeValue(AtomType("int")))
  definePrimitiveVariable("float-t", TypeValue(AtomType("float")))
  definePrimitiveVariable("string-t", TypeValue(AtomType("string")))
  definePrimitiveVariable("symbol-t", TypeValue(AtomType("symbol")))
  definePrimitiveVariable("keyword-t", TypeValue(AtomType("keyword")))
  definePrimitiveVariable("bool-t", TypeValue(AtomType("bool")))
  definePrimitiveVariable("void-t", TypeValue(AtomType("void")))
  definePrimitiveVariable("file-t", TypeValue(AtomType("file")))
  definePrimitiveFunction("list-t", (E: Value) =>
    TypeValue(ListType(asTypeValue(E).type)),
  )
  definePrimitiveFunction("set-t", (E: Value) =>
    TypeValue(SetType(asTypeValue(E).type)),
  )
  definePrimitiveFunction("hash-t", (K: Value, V: Value) =>
    TypeValue(HashType(asTypeValue(K).type, asTypeValue(V).type)),
  )
}

export function definePrimitiveFunction(name: string, fn: TypeFunction): void {
  globalPrimitiveFunctions.set(name, fn)
}

export function definePrimitiveVariable(name: string, value: Value): void {
  globalPrimitiveVariables.set(name, value)
}

export function lookupPrimitiveFunction(
  name: string,
): TypeFunction | undefined {
  return globalPrimitiveFunctions.get(name)
}

export function lookupPrimitiveVariable(name: string): Value | undefined {
  return globalPrimitiveVariables.get(name)
}
