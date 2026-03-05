import { parseSexps } from "../parser/index.ts"
import { prettySexp, type Config } from "./index.ts"

type Format<A> = (x: A) => string
type Pretty<A> = (width: number, x: A) => string

export function prettySexpByFormat<A>(
  format: Format<A>,
  config: Config,
): Pretty<A> {
  return (width, x) => {
    const sexps = parseSexps(format(x))
    return sexps.map((sexp) => prettySexp(width, sexp, config)).join("\n\n")
  }
}
