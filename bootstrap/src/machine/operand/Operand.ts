export type Operand = Imm | Var | Register | Deref | Label

export type Imm = { kind: "Imm"; value: number }
export const Imm = (value: number): Imm => ({ kind: "Imm", value })

export type Var = { kind: "Var"; name: string }
export const Var = (name: string): Var => ({ kind: "Var", name })

export type Register = { kind: "Register"; name: string }
export const Register = (name: string): Register => ({ kind: "Register", name })

export type Deref = { kind: "Deref"; registerName: string; offset: number }
export const Deref = (registerName: string, offset: number): Deref => ({
  kind: "Deref",
  registerName,
  offset,
})

export type Label = { kind: "Label"; name: string }
export const Label = (name: string): Label => ({ kind: "Label", name })
