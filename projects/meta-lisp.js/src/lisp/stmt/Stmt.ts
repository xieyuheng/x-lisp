import { type TokenMeta } from "@xieyuheng/sexp.js"
import type {
  DataConstructor,
  DatatypeConstructor,
} from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt =
  | AboutModule
  | DefineFunction
  | DefineVariable
  | DefineDatatype
  | Claim
  | Exempt

export type DefineFunction = {
  kind: "DefineFunction"
  name: string
  parameters: Array<string>
  body: Exp
  meta?: TokenMeta
}

export function DefineFunction(
  name: string,
  parameters: Array<string>,
  body: Exp,
  meta?: TokenMeta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    name,
    parameters,
    body,
    meta,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  name: string
  body: Exp
  meta?: TokenMeta
}

export function DefineVariable(
  name: string,
  body: Exp,
  meta?: TokenMeta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    name,
    body,
    meta,
  }
}

export type DefineDatatype = {
  kind: "DefineDatatype"
  datatypeConstructor: DatatypeConstructor
  dataConstructors: Array<DataConstructor>
  meta?: TokenMeta
}

export function DefineDatatype(
  datatypeConstructor: DatatypeConstructor,
  dataConstructors: Array<DataConstructor>,
  meta?: TokenMeta,
): DefineDatatype {
  return {
    kind: "DefineDatatype",
    datatypeConstructor,
    dataConstructors,
    meta,
  }
}

export type Claim = {
  kind: "Claim"
  name: string
  type: Exp
  meta?: TokenMeta
}

export function Claim(name: string, type: Exp, meta?: TokenMeta): Claim {
  return {
    kind: "Claim",
    name,
    type,
    meta,
  }
}

export type Exempt = {
  kind: "Exempt"
  names: Array<string>
  meta?: TokenMeta
}

export function Exempt(names: Array<string>, meta?: TokenMeta): Exempt {
  return {
    kind: "Exempt",
    names,
    meta,
  }
}
