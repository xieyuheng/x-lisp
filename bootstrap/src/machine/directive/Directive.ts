export type Directive = Db | Dw | Dd | Dq | String

type Values = Array<number>

export type Db = { kind: "Db"; values: Values }
export const Db = (values: Values): Db => ({ kind: "Db", values })

export type Dw = { kind: "Dw"; values: Values }
export const Dw = (values: Values): Dw => ({ kind: "Dw", values })

export type Dd = { kind: "Dd"; values: Values }
export const Dd = (values: Values): Dd => ({ kind: "Dd", values })

export type Dq = { kind: "Dq"; values: Values }
export const Dq = (values: Values): Dq => ({ kind: "Dq", values })

export type String = { kind: "String"; content: string }
export const String = (content: string): String => ({ kind: "String", content })
