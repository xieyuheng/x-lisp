import * as X from "@xieyuheng/x-sexp.js"
import * as pp from "../../helpers/ppml/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

type Format<A> = (x: A) => string
type Pretty<A> = (maxWidth: number, x: A) => string

export function prettyByFormat<A>(format: Format<A>): Pretty<A> {
  return (maxWidth, x) => {
    const sexps = X.parseSexps(format(x))
    const nodes = sexps.map((sexp) => X.renderSexp(sexp)(sexpConfig))
    return nodes.map((node) => pp.format(maxWidth, node)).join("\n\n")
  }
}
