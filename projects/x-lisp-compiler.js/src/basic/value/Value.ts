import { type Atom } from "./Atom.ts"

export type Value = Atom | Function | Curry | Address

export type Function = {
  kind: "Function"
  name: string
  arity: number
  attributes: {
    isPrimitive: boolean
  }
}

export function Function(
  name: string,
  arity: number,
  attributes: {
    isPrimitive: boolean
  },
): Function {
  return {
    kind: "Function",
    name,
    arity,
    attributes,
  }
}

export type Curry = {
  kind: "Curry"
  target: Value
  arity: number
  args: Array<Value>
}

export function Curry(target: Value, arity: number, args: Array<Value>): Curry {
  return {
    kind: "Curry",
    target,
    arity,
    args,
  }
}

export type Address = {
  kind: "Address"
  name: string
  attributes: {
    isPrimitive: boolean
  }
}

export function Address(
  name: string,
  attributes: {
    isPrimitive: boolean
  },
): Address {
  return {
    kind: "Address",
    name,
    attributes,
  }
}
