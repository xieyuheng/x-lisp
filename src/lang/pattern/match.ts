import { arrayZip } from "../../utils/array/arrayZip.ts"
import { envLookupValue, envSetValue, type Env } from "../env/index.ts"
import { equal } from "../equal/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { type Pattern } from "./Pattern.ts"

type Effect = (env: Env) => Env | undefined

export function match(pattern: Pattern, value: Value): Effect {
  value = Values.lazyWalk(value)

  switch (pattern.kind) {
    case "VarPattern": {
      return (env) => {
        const found = envLookupValue(env, pattern.name)
        if (found === undefined) {
          return envSetValue(env, pattern.name, value)
        }

        if (!equal(found, value)) return undefined

        return env
      }
    }

    case "DataPattern": {
      return (env) => {
        if (value.kind !== "Data") return undefined
        if (!equal(value.constructor, pattern.constructor)) return undefined

        return matchMany(pattern.args, value.elements)(env)
      }
    }

    case "TaelPattern": {
      return (env) => {
        if (value.kind !== "Tael") return undefined

        return sequenceEffect([
          matchMany(pattern.elements, value.elements),
          matchAttributes(pattern.attributes, value.attributes),
        ])(env)
      }
    }

    case "LiteralPattern": {
      return (env) => {
        if (!equal(pattern.value, value)) return undefined

        return env
      }
    }

    case "ConsStarPattern": {
      return (env) => {
        if (value.kind !== "Tael") return undefined
        if (pattern.elements.length > value.elements.length) return undefined

        const prefix = value.elements.slice(0, pattern.elements.length)
        const rest = Values.List(value.elements.slice(pattern.elements.length))
        return sequenceEffect([
          matchMany(pattern.elements, prefix),
          match(pattern.rest, rest),
        ])(env)
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

function matchAttributes(
  patterns: Record<string, Pattern>,
  values: Record<string, Value>,
): Effect {
  return (env) => {
    for (const [key, pattern] of Object.entries(patterns)) {
      const value = values[key]
      if (value === undefined) return undefined
      if (value.kind === "Null") return undefined

      const result = match(pattern, value)(env)
      if (result === undefined) return undefined

      env = result
    }

    return env
  }
}

// combinators

function sequenceEffect(effects: Array<Effect>): Effect {
  return (env) => {
    for (const effect of effects) {
      const result = effect(env)
      if (result === undefined) return undefined

      env = result
    }

    return env
  }
}
