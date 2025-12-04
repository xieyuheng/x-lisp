import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"

export type Directive = Db | Dw | Dd | Dq | String | Int | Float | Pointer

type Values = Array<bigint>

export type Db = {
  kind: "Db"
  values: Values
  meta?: Meta
}

export function Db(values: Values, meta?: Meta): Db {
  return {
    kind: "Db",
    values,
    meta,
  }
}

export type Dw = {
  kind: "Dw"
  values: Values
  meta?: Meta
}

export function Dw(values: Values, meta?: Meta): Dw {
  return {
    kind: "Dw",
    values,
    meta,
  }
}

export type Dd = { kind: "Dd"; values: Values; meta?: Meta }

export function Dd(values: Values, meta?: Meta): Dd {
  return {
    kind: "Dd",
    values,
    meta,
  }
}

export type Dq = {
  kind: "Dq"
  values: Values
  meta?: Meta
}

export function Dq(values: Values, meta?: Meta): Dq {
  return {
    kind: "Dq",
    values,
    meta,
  }
}

export type String = {
  kind: "String"
  content: string
  meta?: Meta
}

export function String(content: string, meta?: Meta): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: bigint
  meta?: Meta
}

export function Int(content: bigint, meta?: Meta): Int {
  return {
    kind: "Int",
    content,
    meta,
  }
}

export type Float = {
  kind: "Float"
  content: number
  meta?: Meta
}

export function Float(content: number, meta?: Meta): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}

export type Pointer = {
  kind: "Pointer"
  name: string
  meta?: Meta
}

export function Pointer(name: string, meta?: Meta): Pointer {
  return {
    kind: "Pointer",
    name,
    meta,
  }
}
