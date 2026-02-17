import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import * as S from "@xieyuheng/sexp.js"
import { textWidth } from "../../config.ts"
import { type Exp } from "../exp/index.ts"
import { prettyExp, prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function assertNotTrue(exp: Exp): Effect {
  return (mod, env) => {
    const width = textWidth
    const value = resultValue(evaluate(exp)(mod, env))

    if (!Values.isBoolValue(value)) {
      let message = `[assertNotTrue] fail on non boolean value`
      message += formatUnderTag(2, `exp:`, prettyExp(width, exp))
      message += formatUnderTag(2, `value:`, prettyValue(width, value))
      throw new S.ErrorWithMeta(message, exp.meta)
    }

    if (Values.isTrueValue(value)) {
      let message = `[assertNotTrue] fail`
      message += formatUnderTag(2, `exp:`, prettyExp(width, exp))
      throw new S.ErrorWithMeta(message, exp.meta)
    }

    return [env, Values.VoidValue()]
  }
}
