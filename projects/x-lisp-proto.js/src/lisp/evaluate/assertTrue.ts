import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import * as S from "@xieyuheng/sexp.js"
import { globals } from "../../globals.ts"
import { type Exp } from "../exp/index.ts"
import { prettyExp, prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function assertTrue(exp: Exp): Effect {
  return (mod, env) => {
    const width = globals.width
    const value = resultValue(evaluate(exp)(mod, env))

    if (!Values.isBool(value)) {
      let message = `[assertTrue] fail on non boolean value`
      message += formatUnderTag(2, `exp:`, prettyExp(width, exp))
      message += formatUnderTag(2, `value:`, prettyValue(width, value))
      throw new S.ErrorWithMeta(message, exp.meta)
    }

    if (Values.isFalse(value)) {
      let message = `[assertTrue] fail`
      message += formatUnderTag(2, `exp:`, prettyExp(width, exp))
      throw new S.ErrorWithMeta(message, exp.meta)
    }

    return [env, Values.Void()]
  }
}
