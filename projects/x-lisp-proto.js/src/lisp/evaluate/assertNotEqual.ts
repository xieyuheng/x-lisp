import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import * as S from "@xieyuheng/sexp.js"
import { globals } from "../../globals.ts"
import { equal } from "../equal/index.ts"
import { type Exp } from "../exp/index.ts"
import { prettyExp, prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function assertNotEqual(lhs: Exp, rhs: Exp): Effect {
  return (mod, env) => {
    const maxWidth = globals.maxWidth
    const lhsValue = resultValue(evaluate(lhs)(mod, env))
    const rhsValue = resultValue(evaluate(rhs)(mod, env))
    if (!equal(lhsValue, rhsValue)) {
      return [env, Values.Void()]
    }

    let message = `[assertNotEqual] fail`
    message += formatUnderTag(2, `lhs exp:`, prettyExp(maxWidth, lhs))
    message += formatUnderTag(2, `rhs exp:`, prettyExp(maxWidth, rhs))
    message += formatUnderTag(2, `lhs value:`, prettyValue(maxWidth, lhsValue))
    message += formatUnderTag(2, `rhs value:`, prettyValue(maxWidth, rhsValue))
    throw new S.ErrorWithMeta(message, rhs.meta)
  }
}
