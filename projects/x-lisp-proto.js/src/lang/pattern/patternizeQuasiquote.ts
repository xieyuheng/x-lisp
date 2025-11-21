import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/x-sexp.js"
import { parseExp } from "../parse/index.ts"
import * as Patterns from "./Pattern.ts"
import { patternize, type Effect } from "./patternize.ts"

export function patternizeQuasiquote(sexp: S.Sexp): Effect {
  if (S.isAtom(sexp)) {
    return (mod, env) => {
      return Patterns.LiteralPattern(sexp)
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
