import type { Env } from "../env/index.ts"
import type { Value } from "../value/index.ts"
import type { Pattern } from "./Pattern.ts"

export function match(value: Value, pattern: Pattern): Env | undefined {
  throw new Error("TODO")
}
