import * as S from "@xieyuheng/x-sexp.js"
import { sexpConfig } from "./sexpConfig.ts"

type Format<A> = (x: A) => string
type Pretty<A> = (maxWidth: number, x: A) => string

export function prettyByFormat<A>(format: Format<A>): Pretty<A> {
  return (maxWidth, x) => {
    const sexps = S.parseSexps(format(x))
    return sexps
      .map((sexp) => S.prettySexp(maxWidth, sexp, sexpConfig))
      .join("\n\n")
  }
}
