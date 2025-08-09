import { type Value } from "../value/index.ts"

export type Env = Map<string, Value>

export function emptyEnv(): Env {
  return new Map()
}

export function envNames(env: Env): Set<string> {
  return new Set(env.keys())
}

export function envGet(env: Env, name: string): undefined | Value {
  return env.get(name)
}

export function envSet(env: Env, name: string, value: Value): Env {
  return new Map([...env, [name, value]])
}
