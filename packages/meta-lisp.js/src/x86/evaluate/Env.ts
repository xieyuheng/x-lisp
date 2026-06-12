import type { Value } from "../value/index.ts"

export type Env = {
  bindings: Map<string, Value>
}

export function emptyEnv(): Env {
  return { bindings: new Map() }
}

export function envLookup(env: Env, name: string): Value | undefined {
  return env.bindings.get(name)
}

export function envPut(env: Env, name: string, value: Value): Env {
  const newBindings = new Map(env.bindings)
  newBindings.set(name, value)
  return { bindings: newBindings }
}

export function envPutMany(
  env: Env,
  names: string[],
  values: Value[],
): Env {
  const newBindings = new Map(env.bindings)
  for (let i = 0; i < names.length; i++) {
    newBindings.set(names[i], values[i])
  }
  return { bindings: newBindings }
}
