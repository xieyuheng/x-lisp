import * as X from "@xieyuheng/x-sexp.js"
import * as pp from "../../helper/ppml/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export function prettyExp(maxWidth: number, exp: Exp): string {
  return pp.format(maxWidth, renderExp(exp))
}

export function renderExps(exps: Array<Exp>): pp.Node {
  return pp.flex(exps.map(renderExp))
}

export function renderExp(exp: Exp): pp.Node {
  const sexp = X.parseSexp(formatExp(exp))
  return X.renderSexp(sexp)(sexpConfig)
}

export function renderBody(body: Exp): pp.Node {
  if (body.kind === "Begin") {
    return renderExps(body.sequence)
  } else {
    return renderExp(body)
  }
}
