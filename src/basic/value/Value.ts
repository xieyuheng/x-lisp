export type Value = Int | Float

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
