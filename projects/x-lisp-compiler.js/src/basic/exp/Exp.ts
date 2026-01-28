import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"

export type Exp = Var | Label | Apply

export type Var = {
  kind: "Var"
  name: string
  meta?: Meta
}

export function Var(name: string, meta?: Meta): Var {
  return {
    kind: "Var",
    name,
    meta,
  }
}

export type Label = {
  kind: "Label"
  name: string
  meta?: Meta
}

export function Label(name: string, meta?: Meta): Label {
  return {
    kind: "Label",
    name,
    meta,
  }
}

export type Apply = {
  kind: "Apply"
  target: Exp
  args: Array<Exp>
  meta?: Meta
}

export function Apply(target: Exp, args: Array<Exp>, meta?: Meta): Apply {
  return {
    kind: "Apply",
    target,
    args,
    meta,
  }
}
