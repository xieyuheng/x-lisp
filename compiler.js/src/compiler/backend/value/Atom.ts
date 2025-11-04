export type Atom = Bool | Void | Int | Float

export type Bool = {
  kind: "Bool"
  content: boolean
}

export function Bool(content: boolean): Bool {
  return {
    kind: "Bool",
    content,
  }
}

export type Void = {
  kind: "Void"
}

export function Void(): Void {
  return {
    kind: "Void",
  }
}

export type Int = {
  kind: "Int"
  content: number
}

export function Int(content: number): Int {
  return {
    kind: "Int",
    content,
  }
}

export type Float = {
  kind: "Float"
  content: number
}

export function Float(content: number): Float {
  return {
    kind: "Float",
    content,
  }
}
