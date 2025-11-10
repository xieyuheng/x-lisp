export type Operand = Imm | Var | Register | Deref | Label

export type Imm = {
  kind: "Imm"
  value: number
}

export type Var = {
  kind: "Var"
  name: string
}

export type Register = {
  kind: "Register"
  name: string
}

export type Deref = {
  kind: "Deref"
  registerName: string
  offset: number
}

export type Label = {
  kind: "Label"
  name: string
}
