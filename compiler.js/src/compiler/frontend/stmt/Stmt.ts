import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Exp } from "../exp/index.ts"

export type Stmt = Compute | DefineFunction

export type Compute = {
  kind: "Compute"
  exp: Exp
  meta: Meta
}

export function Compute(exp: Exp, meta: Meta): Compute {
  return {
    kind: "Compute",
    exp,
    meta,
  }
}

export type DefineFunction = {
  kind: "DefineFunction"
  name: string
  parameters: Array<string>
  body: Exp
  meta: Meta
}

export function DefineFunction(
  name: string,
  parameters: Array<string>,
  body: Exp,
  meta: Meta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    name,
    parameters,
    body,
    meta,
  }
}
