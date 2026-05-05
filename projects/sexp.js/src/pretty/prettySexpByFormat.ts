import * as S from "../index.ts"

type Format<A> = (x: A) => string
type Pretty<A> = (width: number, x: A) => string

export function prettySexpByFormat<A>(
  format: Format<A>,
  config: S.Config,
): Pretty<A> {
  return (width, x) => {
    const sexps = S.parseSexps(format(x), { path: "[prettySexpByFormat]" })
    return sexps.map((sexp) => S.prettySexp(width, sexp, config)).join("\n\n")
  }
}
