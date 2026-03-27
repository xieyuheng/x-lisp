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
  location?: SourceLocation
}

export function DefineFunction(
  name: string,
  parameters: Array<string>,
  body: Exp,
  location?: SourceLocation,
): DefineFunction {
  return {
    kind: "DefineFunction",
    name,
    parameters,
    body,
    location,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  name: string
  body: Exp
  location?: SourceLocation
}

export function DefineVariable(
  name: string,
  body: Exp,
  location?: SourceLocation,
): DefineVariable {
  return {
    kind: "DefineVariable",
    name,
    body,
    location,
  }
}

export type DefineData = {
  kind: "DefineData"
  dataTypeConstructor: Omit<DataTypeConstructor, "definition">
  dataConstructors: Array<Omit<DataConstructor, "definition">>
  location?: SourceLocation
}

export function DefineData(
  dataTypeConstructor: Omit<DataTypeConstructor, "definition">,
  dataConstructors: Array<Omit<DataConstructor, "definition">>,
  location?: SourceLocation,
): DefineData {
  return {
    kind: "DefineData",
    dataTypeConstructor,
    dataConstructors,
    location,
  }
}

export type DefineInterface = {
  kind: "DefineInterface"
  interfaceConstructor: Omit<InterfaceConstructor, "definition">
  attributeTypes: Record<string, Exp>
  location?: SourceLocation
}

export function DefineInterface(
  interfaceConstructor: Omit<InterfaceConstructor, "definition">,
  attributeTypes: Record<string, Exp>,
  location?: SourceLocation,
): DefineInterface {
  return {
    kind: "DefineInterface",
    interfaceConstructor,
    attributeTypes,
    location,
  }
}

export type Claim = {
  kind: "Claim"
  name: string
  type: Exp
  location?: SourceLocation
}

export function Claim(
  name: string,
  type: Exp,
  location?: SourceLocation,
): Claim {
  return {
    kind: "Claim",
    name,
    type,
    location,
  }
}

export type Exempt = {
  kind: "Exempt"
  names: Array<string>
  location?: SourceLocation
}

export function Exempt(
  names: Array<string>,
  location?: SourceLocation,
): Exempt {
  return {
    kind: "Exempt",
    names,
    location,
  }
}
