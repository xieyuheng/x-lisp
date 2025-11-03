import { type Value } from "../value/index.ts"

export function equal(lhs: Value, rhs: Value): boolean {
  if (lhs.kind === "Bool" && rhs.kind === "Bool") {
    return lhs.content === rhs.content
  }

  if (lhs.kind === "Int" && rhs.kind === "Int") {
    return lhs.content === rhs.content
  }

  if (lhs.kind === "Float" && rhs.kind === "Float") {
    return lhs.content === rhs.content
  }

  return false
}
