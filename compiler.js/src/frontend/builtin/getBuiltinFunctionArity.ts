import { builtinFunctionArities } from "./builtinFunctionArities.ts"

export function getBuiltinFunctionArity(name: string): number | undefined {
  return builtinFunctionArities[name]
}

export function hasBuiltinFunction(name: string): Boolean {
  return builtinFunctionArities[name] !== undefined
}
