import { type TokenMeta } from "@xieyuheng/sexp.js"
import type {
  DataConstructorSpec,
  DatatypeConstructorSpec,
} from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt =
  | AboutModule
  | DefineFunction
  | DefineVariable
  | DefineType
  | DefineDatatype
  | Claim

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

export type DefineType = {
  kind: "DefineType"
  name: string
  body: Exp
  meta?: TokenMeta
}

export function DefineType(
  name: string,
  body: Exp,
  meta?: TokenMeta,
): DefineType {
  return {
    kind: "DefineType",
    name,
    body,
    meta,
  }
}

export type DefineDatatype = {
  kind: "DefineDatatype"
  datatypeConstructor: DatatypeConstructorSpec
  dataConstructors: Array<DataConstructorSpec>
  meta?: TokenMeta
}

export function DefineDatatype(
  datatypeConstructor: DatatypeConstructorSpec,
  dataConstructors: Array<DataConstructorSpec>,
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
