import type { Value } from "./Value.ts"

export type Atom = Bool | String | Int | Float
export type Bool = { kind: "Bool"; content: boolean }
export type String = { kind: "String"; content: string }
export type Int = { kind: "Int"; content: number }
export type Float = { kind: "Float"; content: number }

export function isAtom(value: Value): value is Atom {
  return (
    value.kind === "Bool" ||
    value.kind === "String" ||
    value.kind === "Int" ||
    value.kind === "Float"
  )
}

export function Bool(content: boolean): Bool {
  return {
    kind: "Bool",
    content,
  }
}

export function String(content: string): String {
  return {
    kind: "String",
    content,
  }
}

export function Int(content: number): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Int",
    content,
  }
}

export function Float(content: number): Float {
  return {
    kind: "Float",
    content,
  }
}
