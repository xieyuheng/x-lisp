import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"

export type Directive = Db | Dw | Dd | Dq | String

type Values = Array<number>

export type Db = { kind: "Db"; values: Values; meta?: Meta }
export const Db = (values: Values, meta?: Meta): Db => ({
  kind: "Db",
  values,
  meta,
})

export type Dw = { kind: "Dw"; values: Values; meta?: Meta }
export const Dw = (values: Values, meta?: Meta): Dw => ({
  kind: "Dw",
  values,
  meta,
})

export type Dd = { kind: "Dd"; values: Values; meta?: Meta }
export const Dd = (values: Values, meta?: Meta): Dd => ({
  kind: "Dd",
  values,
  meta,
})

export type Dq = { kind: "Dq"; values: Values; meta?: Meta }
export const Dq = (values: Values, meta?: Meta): Dq => ({
  kind: "Dq",
  values,
  meta,
})

export type String = { kind: "String"; content: string; meta?: Meta }
export const String = (content: string, meta?: Meta): String => ({
  kind: "String",
  content,
  meta,
})
