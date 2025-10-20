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

export type Constant = Instr & {
  dest: string
  op: "const"
  value: Value
}

export function isConstant(instr: Instr): instr is Constant {
  return (
    instr.dest !== undefined &&
    instr.value !== undefined &&
    instr.op === "const"
  )
}

export type Operation = Instr & {
  dest: string
}

export function isOperation(instr: Instr): instr is Operation {
  return instr.dest !== undefined && instr.op !== "const"
}

export type Effect = Instr & {
  dest: undefined
}

export function isEffect(instr: Instr): instr is Effect {
  return instr.dest === undefined
}
