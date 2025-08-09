import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/formatExp.ts"
import { modGetValue, type Mod } from "../mod/index.ts"
import * as Patterns from "./Pattern.ts"
import { type Pattern } from "./Pattern.ts"

type Effect = (mod: Mod, env: Env) => Pattern

export function patternize(exp: Exp): Effect {
  return (mod, env) => {
    if (exp.kind === "Var") {
      const topValue = modGetValue(mod, exp.name)
      if (topValue && topValue.kind === "DataConstructor") {
        return Patterns.DataConstructorPattern(topValue)
      } else {
        return Patterns.VarPattern(exp.name)
      }
    }

    if (exp.kind === "Apply") {
      return Patterns.ApplyPattern(
        patternize(exp.target)(mod, env),
        exp.args.map((arg) => patternize(arg)(mod, env)),
      )
    }

    let message = `[patternize] unhandled kind of exp\n`
    message += `  exp: ${formatExp(exp)}`
    throw new Error(message)
  }
}
