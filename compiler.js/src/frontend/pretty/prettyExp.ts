import * as X from "@xieyuheng/x-sexp.js"
import * as pp from "../../helpers/ppml/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export function prettyExp(maxWidth: number, exp: Exp): string {
  return pp.format(maxWidth, renderExp(exp))
}

function renderExp(exp: Exp): pp.Node {
  const sexp = X.parseSexp(formatExp(exp))
  return X.renderSexp(sexp)(sexpConfig)
}
