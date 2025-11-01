import * as X from "@xieyuheng/x-sexp.js"
import * as pp from "../../helpers/ppml/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

type Format<A> = (x: A) => string
type Pretty<A> = (maxWidth: number, x: A) => string

export function prettyByFormat<A>(format: Format<A>): Pretty<A> {
  return (maxWidth, x) => {
    const sexp = X.parseSexp(format(x))
    const node = X.renderSexp(sexp)(sexpConfig)
    return pp.format(maxWidth, node)
  }
}
