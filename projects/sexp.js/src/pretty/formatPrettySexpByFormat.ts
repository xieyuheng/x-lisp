import * as S from "../index.ts"

type Format<A> = (x: A) => string
type Pretty<A> = (width: number, x: A) => string

export function formatPrettySexpByFormat<A>(
  format: Format<A>,
  config: S.Config,
): Pretty<A> {
  return (width, x) => {
    const sexps = S.parseSexps(format(x), {
      path: "[formatPrettySexpByFormat]",
    })
    return sexps
      .map((sexp) => S.formatPrettySexp(width, sexp, config))
      .join("\n\n")
  }
}
