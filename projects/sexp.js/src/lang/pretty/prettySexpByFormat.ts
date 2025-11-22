import { parseSexps } from "../parser/index.ts"
import { prettySexp, type Config } from "./index.ts"

type Format<A> = (x: A) => string
type Pretty<A> = (maxWidth: number, x: A) => string

export function prettySexpByFormat<A>(
  format: Format<A>,
  config: Config,
): Pretty<A> {
  return (maxWidth, x) => {
    const sexps = parseSexps(format(x))
    return sexps.map((sexp) => prettySexp(maxWidth, sexp, config)).join("\n\n")
  }
}
