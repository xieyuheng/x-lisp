import { type TokenMeta } from "@xieyuheng/x-sexp.js"
import { type Exp } from "../exp/index.ts"

export type Meta = TokenMeta

export type Definition = FunctionDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  parameters: Array<string>
  body: Exp
  meta: Meta
}

export function FunctionDefinition(
  name: string,
  parameters: Array<string>,
  body: Exp,
  meta: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    name,
    parameters,
    body,
    meta,
  }
}
