import assert from "node:assert"
import { builtinFunctionEntries } from "./index.ts"

export function getBuiltinFunctionArity(name: string): number {
  const entry = builtinFunctionEntries[name]
  assert(entry)
  return entry.arity
}
