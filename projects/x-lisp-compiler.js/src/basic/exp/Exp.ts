export type Exp = Var | Label

export type Var = {
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Var",
    name,
  }
}

export type Label = {
  kind: "Label"
  name: string
}

export function Label(name: string): Label {
  return {
    kind: "Label",
    name,
  }
}
