import { arrayZip } from "../../utils/array/arrayZip.ts"
import { envLookupValue, envSetValue, type Env } from "../env/index.ts"
import { equal } from "../equal/index.ts"
import type { Value } from "../value/index.ts"
import type { Pattern } from "./Pattern.ts"

type Effect = (env: Env) => Env | undefined

export function match(target: Value, pattern: Pattern): Effect {
  switch (pattern.kind) {
    case "VarPattern": {
      return (env) => {
        const found = envLookupValue(env, pattern.name)
        if (found) {
          if (equal(found, target)) {
            return env
          } else {
            return undefined
          }
        } else {
          return envSetValue(env, pattern.name, target)
        }
      }
    }

    case "DataPattern": {
      return (env) => {
        if (
          target.kind === "Data" &&
          equal(target.constructor, pattern.constructor)
        ) {
          return matchMany(target.elements, pattern.args)(env)
        } else {
          return undefined
        }
      }
    }

    case "TaelPattern": {
      return (env) => {
        if (target.kind === "Tael") {
          return matchMany(target.elements, pattern.elements)(env)
        } else {
          return undefined
        }
      }
    }
  }
}

function matchMany(targets: Array<Value>, patterns: Array<Pattern>): Effect {
  return (env) => {
    if (targets.length !== patterns.length) return undefined

    for (const [target, pattern] of arrayZip(targets, patterns)) {
      const result = match(target, pattern)(env)
      if (!result) return undefined

      env = result
    }

    return env
  }
}
