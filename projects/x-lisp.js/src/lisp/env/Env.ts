import assert from "node:assert"
import { type Value } from "../value/index.ts"

export type Env = Map<string, Value>

export function emptyEnv(): Env {
  return new Map()
}

export function envNames(env: Env): Set<string> {
  return new Set(env.keys())
}

export function envLookupValue(env: Env, name: string): undefined | Value {
  return env.get(name)
}

export function envPut(env: Env, name: string, value: Value): Env {
  return new Map([...env, [name, value]])
}

export function envPutMany(
  env: Env,
  parameters: Array<string>,
  values: Array<Value>,
): Env {
  assert(parameters.length === values.length)
  for (const [index, name] of parameters.entries()) {
    env = envPut(env, name, values[index])
  }
  return env
}

export function envUpdate(base: Env, env: Env): Env {
  for (const name of envNames(env)) {
    const value = envLookupValue(env, name)
    assert(value)
    base = envPut(base, name, value)
  }

  return base
}
