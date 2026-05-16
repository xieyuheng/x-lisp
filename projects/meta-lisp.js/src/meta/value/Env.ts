import { type Value } from "./Value.ts"

export type Env = {
  bindings: Map<string, Value>
}

export function emptyEnv(): Env {
  return { bindings: new Map() }
}

export function envNames(env: Env): Set<string> {
  return new Set(env.bindings.keys())
}

export function envLookup(env: Env, name: string): Value | undefined {
  return env.bindings.get(name)
}

export function envPut(env: Env, name: string, value: Value): Env {
  return {
    bindings: new Map([...env.bindings, [name, value]]),
  }
}

export function envPutMany(
  env: Env,
  names: Array<string>,
  values: Array<Value>,
): Env {
  for (const [index, name] of names.entries()) {
    env = envPut(env, name, values[index])
  }
  return env
}
