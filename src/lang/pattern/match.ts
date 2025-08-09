import { envGet, envSet, type Env } from "../env/index.ts"
import { equal } from "../equal/index.ts"
import type { Value } from "../value/index.ts"
import type { Pattern } from "./Pattern.ts"

type Effect = (env: Env) => Env | undefined

export function match(target: Value, pattern: Pattern): Effect {
  switch (pattern.kind) {
    case "VarPattern": {
      return (env) => {
        const found = envGet(env, pattern.name)
        if (found) {
          if (equal(found, target)) {
            return env
          } else {
            return undefined
          }
        } else {
          return envSet(env, pattern.name, target)
        }
      }
    }

    case "ApplyPattern": {
      return (env) => {
        throw new Error("TODO")
      }
    }

    case "DataConstructorPattern": {
      return (env) => {
        if (
          target.kind === "Data" &&
          equal(target.constructor, pattern.constructor) &&
          target.constructor.fields.length === 0
        ) {
          return env
        } else {
          return undefined
        }
      }
    }
  }
}
