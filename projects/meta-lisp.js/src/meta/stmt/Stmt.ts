import { type SourceLocation } from "@xieyuheng/sexp.js"
import type {
  DataConstructor,
  DataTypeConstructor,
  InterfaceConstructor,
} from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"

export type Stmt =
  | Import
  | ImportAs
  | ImportAll
  | DefineFunction
  | DefineVariable
  | DefineTest
  | DefineType
  | DefineData
  | DefineInterface
  | Claim
  | Admit
  | Private
  | Exempt
  | DeclareModule
  | DeclareTypeErrorModule
  | DeclarePrimitiveFunction
  | DeclarePrimitiveVariable

export type Import = {
  kind: "Import"
  modName: string
  names: Array<string>
  location?: SourceLocation
}

export function Import(
  modName: string,
  names: Array<string>,
  location?: SourceLocation,
): Import {
  return {
    kind: "Import",
    modName,
    names,
    location,
  }
}

export type ImportAs = {
  kind: "ImportAs"
  modName: string
  prefix: string
  location?: SourceLocation
}

export function ImportAs(
  modName: string,
  prefix: string,
  location?: SourceLocation,
): ImportAs {
  return {
    kind: "ImportAs",
    modName,
    prefix,
    location,
  }
}

export type ImportAll = {
  kind: "ImportAll"
  modName: string
  location?: SourceLocation
}

export function ImportAll(
  modName: string,
  location?: SourceLocation,
): ImportAll {
  return {
    kind: "ImportAll",
    modName,
    location,
  }
}

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

export type DefineType = {
  kind: "DefineType"
  name: string
  parameters: Array<string>
  body: Exp
  location?: SourceLocation
}

export function DefineType(
  name: string,
  parameters: Array<string>,
  body: Exp,
  location?: SourceLocation,
): DefineType {
  return {
    kind: "DefineType",
    name,
    parameters,
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

export type Admit = {
  kind: "Admit"
  name: string
  type: Exp
  location?: SourceLocation
}

export function Admit(
  name: string,
  type: Exp,
  location?: SourceLocation,
): Admit {
  return {
    kind: "Admit",
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

export type Private = {
  kind: "Private"
  names: Array<string>
  location?: SourceLocation
}

export function Private(
  names: Array<string>,
  location?: SourceLocation,
): Private {
  return {
    kind: "Private",
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

export type DeclarePrimitiveFunction = {
  kind: "DeclarePrimitiveFunction"
  name: string
  arity: number
  location?: SourceLocation
}

export function DeclarePrimitiveFunction(
  name: string,
  arity: number,
  location?: SourceLocation,
): DeclarePrimitiveFunction {
  return {
    kind: "DeclarePrimitiveFunction",
    name,
    arity,
    location,
  }
}

export type DeclarePrimitiveVariable = {
  kind: "DeclarePrimitiveVariable"
  name: string
  location?: SourceLocation
}

export function DeclarePrimitiveVariable(
  name: string,
  location?: SourceLocation,
): DeclarePrimitiveVariable {
  return {
    kind: "DeclarePrimitiveVariable",
    name,
    location,
  }
}
