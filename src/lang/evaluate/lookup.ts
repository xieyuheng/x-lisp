import { envLookupValue, type Env } from "../env/index.ts"
import { modLookupValue, type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function lookup(mod: Mod, env: Env, name: string): Value | undefined {
  const value = envLookupValue(env, name)
  if (value) return Values.lazyWalk(value)

  const topValue = modLookupValue(mod, name)
  if (topValue) return Values.lazyWalk(topValue)

  return undefined
}
