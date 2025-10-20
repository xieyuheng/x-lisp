export type Value = "TODO"
export type Type = "TODO"

export type Instr = {
  dest?: string
  type?: Type
  op: string
  refs?: Array<string>
  operands?: Array<string>
  labels?: Array<string>
  value?: Value
}

export type Const = {
  dest: string
  type: Type
  op: "const"
  value: Value
}

export type Operation = {
  dest: string
  type: Type
  op: string
  refs?: Array<string>
  operands?: Array<string>
  labels?: Array<string>
}

export type Effect = {
  op: string
  refs?: Array<string>
  operands?: Array<string>
  labels?: Array<string>
}
