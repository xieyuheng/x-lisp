import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Exp } from "../exp/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt = AboutModule | Compute | DefineFunction | DefineConstant

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

export type DefineConstant = {
  kind: "DefineConstant"
  name: string
  body: Exp
  meta: Meta
}

export function DefineConstant(
  name: string,
  body: Exp,
  meta: Meta,
): DefineConstant {
  return {
    kind: "DefineConstant",
    name,
    body,
    meta,
  }
}
