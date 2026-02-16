import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
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
  | DefineDatatype
  | Claim

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

export type DefineVariable = {
  kind: "DefineVariable"
  name: string
  body: Exp
  meta: Meta
}

export function DefineVariable(
  name: string,
  body: Exp,
  meta: Meta,
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
  datatypeConstructor: DatatypeConstructorSpec
  dataConstructors: Array<DataConstructorSpec>
  meta: Meta
}

export function DefineDatatype(
  datatypeConstructor: DatatypeConstructorSpec,
  dataConstructors: Array<DataConstructorSpec>,
  meta: Meta,
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
  schema: Exp
  meta: Meta
}

export function Claim(name: string, schema: Exp, meta: Meta): Claim {
  return {
    kind: "Claim",
    name,
    schema,
    meta,
  }
}
