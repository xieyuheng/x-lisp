import { type Atom } from "./Atom.ts"

export type Value = Atom | FunctionRef | Curry

export type FunctionRef = {
  kind: "FunctionRef"
  name: string
  arity: number
}

export function FunctionRef(name: string, arity: number): FunctionRef {
  return {
    kind: "FunctionRef",
    name,
    arity,
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
