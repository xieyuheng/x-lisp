import { type Atom } from "./Atom.ts"

export type Value = Atom | FunctionRef | Curry | Address

export type FunctionRef = {
  kind: "FunctionRef"
  name: string
  arity: number
  attributes: {
    isPrimitive: boolean
  }
}

export function FunctionRef(
  name: string,
  arity: number,
  attributes: {
    isPrimitive: boolean
  },
): FunctionRef {
  return {
    kind: "FunctionRef",
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
