import type { Env } from "../env/index.ts"
import type { Value } from "../value/index.ts"
import type { Pattern } from "./Pattern.ts"

type Effect = (env: Env) => Env | undefined

export function match(target: Value, pattern: Pattern): Effect {
  switch (pattern.kind) {
    case "VarPattern": {
      return (env) => {
        throw new Error("TODO")
      }
    }

    case "ApplyPattern": {
      return (env) => {
        throw new Error("TODO")
      }
    }

    case "DataConstructorPattern": {
      return (env) => {
        throw new Error("TODO")
      }
    }
  }
}
