import type { Env } from "../env/index.ts"
import type { Value } from "../value/index.ts"
import type { Pattern } from "./Pattern.ts"

export function match(target: Value, pattern: Pattern): Env | undefined {
  throw new Error("TODO match")
}
