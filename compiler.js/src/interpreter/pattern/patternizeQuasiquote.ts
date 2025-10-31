import * as X from "@xieyuheng/x-sexp.js"
import { recordMapValue } from "../../helpers/record/recordMapValue.ts"
import { matchExp } from "../syntax/index.ts"
import * as Patterns from "./Pattern.ts"
import { patternize, type Effect } from "./patternize.ts"

export function patternizeQuasiquote(sexp: X.Sexp): Effect {
  if (X.isAtom(sexp)) {
    return (mod, env) => {
      return Patterns.LiteralPattern(sexp)
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
      return patternize(exp)
    } else {
      return (mod, env) => {
        return Patterns.TaelPattern(
          sexp.elements.map((e) => patternizeQuasiquote(e)(mod, env)),
          recordMapValue(sexp.attributes, (e) =>
            patternizeQuasiquote(e)(mod, env),
          ),
        )
      }
    }
  }

  throw new Error("[patternizeQuasiquote] unknown kind of data")
}
