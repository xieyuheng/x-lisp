import * as M from "../index.ts"

export type EvaluationMode = "OpaqueMode" | "TransparentMode"

export type Env = {
  mode: EvaluationMode
  bindings: Map<string, M.Value>
}

export function emptyEnv(mode: EvaluationMode): Env {
  return { mode, bindings: new Map() }
}

export function envMode(env: Env): EvaluationMode {
  return env.mode
}

export function envNames(env: Env): Set<string> {
  return new Set(env.bindings.keys())
}

export function envLookup(env: Env, name: string): M.Value | undefined {
  return env.bindings.get(name)
}

export function envPut(env: Env, name: string, value: M.Value): Env {
  return {
    ...env,
    bindings: new Map([...env.bindings, [name, value]]),
  }
}

export function envPutMany(
  env: Env,
  names: Array<string>,
  values: Array<M.Value>,
): Env {
  for (const [index, name] of names.entries()) {
    env = envPut(env, name, values[index])
  }
  return env
}
