import * as S from "@xieyuheng/x-sexp.js"
import { globals } from "../../globals.ts"
import { formatUnderTag } from "../../helpers/format/formatUnderTag.ts"
import { type Exp } from "../exp/index.ts"
import { prettyExp, prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function assertNotTrue(exp: Exp): Effect {
  return (mod, env) => {
    const maxWidth = globals.maxWidth
    const value = resultValue(evaluate(exp)(mod, env))

    if (!Values.isBool(value)) {
      let message = `[assertNotTrue] fail on non boolean value`
      message += formatUnderTag(2, `exp:`, prettyExp(maxWidth, exp))
      message += formatUnderTag(2, `value:`, prettyValue(maxWidth, value))
      throw new S.ErrorWithMeta(message, exp.meta)
    }

    if (Values.isTrue(value)) {
      let message = `[assertNotTrue] fail`
      message += formatUnderTag(2, `exp:`, prettyExp(maxWidth, exp))
      throw new S.ErrorWithMeta(message, exp.meta)
    }

    return [env, Values.Void()]
  }
}
