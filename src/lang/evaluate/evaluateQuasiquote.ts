import * as X from "@xieyuheng/x-data.js"
import { recordMap } from "../../utils/record/recordMap.ts"
import { matchExp } from "../syntax/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function evaluateQuasiquote(sexp: X.Data): Effect {
  if (X.isAtom(sexp)) {
    return (mod, env) => {
      return [env, sexp]
    }
  }

  if (X.isTael(sexp)) {
    if (
      sexp.kind === "Tael" &&
      sexp.elements.length >= 2 &&
      sexp.elements[0].kind === "Symbol" &&
      sexp.elements[0].content === "@unquote"
    ) {
      const firstSexp = X.asTael(sexp).elements[1]
      const exp = matchExp(firstSexp)
      return evaluate(exp)
    } else {
      return (mod, env) => {
        return [
          env,
          Values.Tael(
            sexp.elements.map((e) =>
              resultValue(evaluateQuasiquote(e)(mod, env)),
            ),
            recordMap(sexp.attributes, (e) =>
              resultValue(evaluateQuasiquote(e)(mod, env)),
            ),
          ),
        ]
      }
    }
  }

  throw new Error("[evaluateQuasiquote] unknown kind of data")
}
