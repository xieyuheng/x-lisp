import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/formatExp.ts"
import { modLookup, type Mod } from "../mod/index.ts"
import * as Patterns from "./Pattern.ts"
import { type Pattern } from "./Pattern.ts"

type Effect = (mod: Mod, env: Env) => Pattern

export function patternize(exp: Exp): Effect {
  return (mod, env) => {
    if (exp.kind === "Var") {
      const topValue = modLookup(mod, exp.name)
      if (
        topValue &&
        topValue.kind === "Data" &&
        topValue.elements.length === 0
      ) {
        return Patterns.DataPattern(topValue.constructor, [])
      } else {
        return Patterns.VarPattern(exp.name)
      }
    }

    if (exp.kind === "Apply") {
      if (exp.target.kind !== "Var") {
        let message = `[patternize] The target of apply must be a var\n`
        message += `  exp: ${formatExp(exp)}`
        throw new Error(message)
      }

      const topValue = modLookup(mod, exp.target.name)
      if (topValue && topValue.kind === "DataConstructor") {
        return Patterns.DataPattern(
          topValue,
          exp.args.map((arg) => patternize(arg)(mod, env)),
        )
      } else {
        let message = `[patternize] The target of apply must be data constructor\n`
        message += `  exp: ${formatExp(exp)}`
        throw new Error(message)
      }
    }

    let message = `[patternize] unhandled kind of exp\n`
    message += `  exp: ${formatExp(exp)}`
    throw new Error(message)
  }
}
