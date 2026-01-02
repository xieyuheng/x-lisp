import assert from "node:assert"
import { builtinFunctionEntries } from "./index.ts"

export function hasBuiltinFunction(name: string): boolean {
  return Boolean(builtinFunctionEntries[name])
}

export function getBuiltinFunctionArity(name: string): number  {
  const entry = builtinFunctionEntries[name]
  if (!entry) {
    let message = `[getBuiltinFunctionArity] undefined name`
    message += `\n  name: ${name}`
    throw new Error(message)
  }

  return entry.arity
}
