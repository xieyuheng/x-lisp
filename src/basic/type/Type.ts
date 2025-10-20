export type Type = AtomType | TermType

export type AtomType = {
  kind: "AtomType"
  name: string
}

export function AtomType(name: string): AtomType {
  return {
    kind: "AtomType",
    name,
  }
}

export type TermType = {
  kind: "TermType"
  name: string
  args: Array<Type>
}

export function TermType(name: string, args: Array<Type>): TermType {
  return {
    kind: "TermType",
    name,
    args,
  }
}
