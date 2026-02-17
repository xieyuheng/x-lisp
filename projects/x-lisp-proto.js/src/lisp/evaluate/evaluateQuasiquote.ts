import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import { parseExp } from "../parse/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function evaluateQuasiquote(sexp: S.Sexp): Effect {
  if (S.isAtom(sexp)) {
    return (mod, env) => {
      return [env, sexp]
    }
  }

  if (S.isTael(sexp)) {
    if (
      sexp.kind === "Tael" &&
      sexp.elements.length >= 2 &&
      sexp.elements[0].kind === "Symbol" &&
      sexp.elements[0].content === "@unquote"
    ) {
      const firstSexp = S.asTael(sexp).elements[1]
      const exp = parseExp(firstSexp)
      return evaluate(exp)
    } else {
      return (mod, env) => {
        return [
          env,
          Values.TaelValue(
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
