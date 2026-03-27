import { type SourceLocation } from "@xieyuheng/sexp.js"
import type {
  DataConstructor,
  DataTypeConstructor,
  InterfaceConstructor,
} from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt =
  | AboutModule
  | DefineFunction
  | DefineVariable
  | DefineData
  | DefineInterface
  | Claim
  | Exempt

export type DefineFunction = {
  kind: "DefineFunction"
  name: string
  parameters: Array<string>
  body: Exp
  meta?: SourceLocation
}

export function DefineFunction(
  name: string,
  parameters: Array<string>,
  body: Exp,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function DefineVariable(
  name: string,
  body: Exp,
  meta?: SourceLocation,
): DefineVariable {
  return {
    kind: "DefineVariable",
    name,
    body,
    meta,
  }
}

export type DefineData = {
  kind: "DefineData"
  dataTypeConstructor: Omit<DataTypeConstructor, "definition">
  dataConstructors: Array<Omit<DataConstructor, "definition">>
  meta?: SourceLocation
}

export function DefineData(
  dataTypeConstructor: Omit<DataTypeConstructor, "definition">,
  dataConstructors: Array<Omit<DataConstructor, "definition">>,
  meta?: SourceLocation,
): DefineData {
  return {
    kind: "DefineData",
    dataTypeConstructor,
    dataConstructors,
    meta,
  }
}

export type DefineInterface = {
  kind: "DefineInterface"
  interfaceConstructor: Omit<InterfaceConstructor, "definition">
  attributeTypes: Record<string, Exp>
  meta?: SourceLocation
}

export function DefineInterface(
  interfaceConstructor: Omit<InterfaceConstructor, "definition">,
  attributeTypes: Record<string, Exp>,
  meta?: SourceLocation,
): DefineInterface {
  return {
    kind: "DefineInterface",
    interfaceConstructor,
    attributeTypes,
    meta,
  }
}

export type Claim = {
  kind: "Claim"
  name: string
  type: Exp
  meta?: SourceLocation
}

export function Claim(name: string, type: Exp, meta?: SourceLocation): Claim {
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
  meta?: SourceLocation
}

export function Exempt(names: Array<string>, meta?: SourceLocation): Exempt {
  return {
    kind: "Exempt",
    names,
    meta,
  }
}
