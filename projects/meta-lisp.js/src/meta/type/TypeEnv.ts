import assert from "node:assert"
import { type Type } from "./Type.ts"

export type TypeEnv = Map<string, Type>

export function typeEnvEmpty(): TypeEnv {
  return new Map()
}

export function typeEnvNames(typeEnv: TypeEnv): Set<string> {
  return new Set(typeEnv.keys())
}

export function typeEnvLookup(
  typeEnv: TypeEnv,
  name: string,
): undefined | Type {
  return typeEnv.get(name)
}

export function typeEnvPut(
  typeEnv: TypeEnv,
  name: string,
  type: Type,
): TypeEnv {
  return new Map([...typeEnv, [name, type]])
}

export function typeEnvPutMany(
  typeEnv: TypeEnv,
  parameters: Array<string>,
  types: Array<Type>,
): TypeEnv {
  assert(parameters.length === types.length)
  for (const [index, name] of parameters.entries()) {
    typeEnv = typeEnvPut(typeEnv, name, types[index])
  }
  return typeEnv
}
