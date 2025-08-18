import { arrayZip } from "../../utils/array/arrayZip.ts"
import { envLookupValue, envSetValue, type Env } from "../env/index.ts"
import { equal } from "../equal/index.ts"
import type { Value } from "../value/index.ts"
import type { Pattern } from "./Pattern.ts"

type Effect = (env: Env) => Env | undefined

export function match(pattern: Pattern, value: Value): Effect {
  switch (pattern.kind) {
    case "VarPattern": {
      return (env) => {
        const found = envLookupValue(env, pattern.name)
        if (found) {
          if (equal(found, value)) {
            return env
          } else {
            return undefined
          }
        } else {
          return envSetValue(env, pattern.name, value)
        }
      }
    }

    case "DataPattern": {
      return (env) => {
        if (
          value.kind === "Data" &&
          equal(value.constructor, pattern.constructor)
        ) {
          return matchMany(pattern.args, value.elements)(env)
        } else {
          return undefined
        }
      }
    }

    case "TaelPattern": {
      return (env) => {
        if (value.kind === "Tael") {
          return matchMany(pattern.elements, value.elements)(env)
        } else {
          return undefined
        }
      }
    }
  }
}

function matchMany(patterns: Array<Pattern>, values: Array<Value>): Effect {
  return (env) => {
    if (values.length !== patterns.length) return undefined

    return sequenceEffect(
      arrayZip(patterns, values).map(([pattern, value]) =>
        match(pattern, value),
      ),
    )(env)
  }
}

// combinators

function sequenceEffect(effects: Array<Effect>): Effect {
  return (env) => {
    for (const effect of effects) {
      const result = effect(env)
      if (!result) return undefined
      env = result
    }

    return env
  }
}
