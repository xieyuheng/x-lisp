import { type SourceLocation } from "@xieyuheng/sexp.js"
import type {
  DataConstructor,
  DataTypeConstructor,
  InterfaceConstructor,
} from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import type { AboutImport } from "./AboutImport.ts"

export type Stmt =
  | AboutImport
  | DefineFunction
  | DefineVariable
  | DefineTest
  | DefineData
  | DefineInterface
  | Claim
  | Exempt
  | DeclareModule
| DeclareTypeErrorModule

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


export type DefineTest = {
  kind: "DefineTest"
  name: string
  body: Exp
  location?: SourceLocation
}

export function DefineTest(
  name: string,
  body: Exp,
  location?: SourceLocation,
): DefineTest {
  return {
    kind: "DefineTest",
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

export type DeclareModule = {
  kind: "DeclareModule"
  name: string
  location?: SourceLocation
}

export function DeclareModule(
  name: string,
  location?: SourceLocation,
): DeclareModule {
  return {
    kind: "DeclareModule",
    name,
    location,
  }
}

export type DeclareTypeErrorModule = {
  kind: "DeclareTypeErrorModule"
  name: string
  location?: SourceLocation
}

export function DeclareTypeErrorModule(
  name: string,
  location?: SourceLocation,
): DeclareTypeErrorModule {
  return {
    kind: "DeclareTypeErrorModule",
    name,
    location,
  }
}
