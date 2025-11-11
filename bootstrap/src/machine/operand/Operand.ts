export type Operand = Imm | Var | Reg | Deref | Label

export type Imm = { kind: "Imm"; value: number }
export const Imm = (value: number): Imm => ({ kind: "Imm", value })

export type Var = { kind: "Var"; name: string }
export const Var = (name: string): Var => ({ kind: "Var", name })

export type Reg = { kind: "Reg"; name: string }
export const Reg = (name: string): Reg => ({ kind: "Reg", name })

export type Deref = { kind: "Deref"; regName: string; offset: number }
export const Deref = (regName: string, offset: number): Deref => ({
  kind: "Deref",
  regName,
  offset,
})

export type Label = { kind: "Label"; name: string }
export const Label = (name: string): Label => ({ kind: "Label", name })
