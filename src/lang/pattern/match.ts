import { arrayZip } from "../../utils/array/arrayZip.ts"
import { envLookupValue, envSetValue, type Env } from "../env/index.ts"
import { equal } from "../equal/index.ts"
import type { Value } from "../value/index.ts"
import type { Pattern } from "./Pattern.ts"

type Effect = (env: Env) => Env | undefined

export function match(pattern: Pattern, target: Value): Effect {
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
          return matchMany(pattern.args, target.elements)(env)
        } else {
          return undefined
        }
      }
    }

    case "TaelPattern": {
      return (env) => {
        if (target.kind === "Tael") {
          return matchMany(pattern.elements, target.elements)(env)
        } else {
          return undefined
        }
      }
    }
  }
}

function matchMany(patterns: Array<Pattern>, targets: Array<Value>): Effect {
  return (env) => {
    if (targets.length !== patterns.length) return undefined

    for (const [target, pattern] of arrayZip(targets, patterns)) {
      const result = match(pattern, target)(env)
      if (!result) return undefined

      env = result
    }

    return env
  }
}
