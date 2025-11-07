import * as X from "@xieyuheng/x-sexp.js"
import { recordMapValue } from "../../helpers/record/recordMapValue.ts"
import { parseExp } from "../parse/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function evaluateQuasiquote(sexp: X.Sexp): Effect {
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
      const exp = parseExp(firstSexp)
      return evaluate(exp)
    } else {
      return (mod, env) => {
        return [
          env,
          Values.Tael(
            sexp.elements.map((e) =>
              resultValue(evaluateQuasiquote(e)(mod, env)),
            ),
            recordMapValue(sexp.attributes, (e) =>
              resultValue(evaluateQuasiquote(e)(mod, env)),
            ),
          ),
        ]
      }
    }
  }

  throw new Error("[evaluateQuasiquote] unknown kind of data")
}
