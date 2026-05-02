import { type SourceLocation } from "@xieyuheng/sexp.js"
import { type Exp } from "../exp/index.ts"
import type { Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

export type Definition =
  | PrimitiveFunctionDefinition
  | PrimitiveVariableDefinition
  | PrimitiveFunctionDeclaration
  | PrimitiveVariableDeclaration
  | FunctionDefinition
  | VariableDefinition
  | TestDefinition
  | TypeDefinition
  | DataDefinition
  | InterfaceDefinition

export type DefinitionState = {
  isChecked?: boolean
}

export type ValueFunction = (...args: Array<Value>) => Value

export type PrimitiveFunctionDefinition = {
  kind: "PrimitiveFunctionDefinition"
  mod: Mod
  name: string
  arity: number
  fn: ValueFunction
  location?: SourceLocation
} & DefinitionState

export function PrimitiveFunctionDefinition(
  mod: Mod,
  name: string,
  arity: number,
  fn: ValueFunction,
  location?: SourceLocation,
): PrimitiveFunctionDefinition {
  return {
    kind: "PrimitiveFunctionDefinition",
    mod,
    name,
    arity,
    fn,
    location,
  }
}

export type PrimitiveVariableDefinition = {
  kind: "PrimitiveVariableDefinition"
  mod: Mod
  name: string
  value: Value
  location?: SourceLocation
} & DefinitionState

export function PrimitiveVariableDefinition(
  mod: Mod,
  name: string,
  value: Value,
  location?: SourceLocation,
): PrimitiveVariableDefinition {
  return {
    kind: "PrimitiveVariableDefinition",
    mod,
    name,
    value,
    location,
  }
}

export type PrimitiveFunctionDeclaration = {
  kind: "PrimitiveFunctionDeclaration"
  mod: Mod
  name: string
  arity: number
  location?: SourceLocation
} & DefinitionState

export function PrimitiveFunctionDeclaration(
  mod: Mod,
  name: string,
  arity: number,
  location?: SourceLocation,
): PrimitiveFunctionDeclaration {
  return {
    kind: "PrimitiveFunctionDeclaration",
    mod,
    name,
    arity,
    location,
  }
}

export type PrimitiveVariableDeclaration = {
  kind: "PrimitiveVariableDeclaration"
  mod: Mod
  name: string
  location?: SourceLocation
} & DefinitionState

export function PrimitiveVariableDeclaration(
  mod: Mod,
  name: string,
  location?: SourceLocation,
): PrimitiveVariableDeclaration {
  return {
    kind: "PrimitiveVariableDeclaration",
    mod,
    name,
    location,
  }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  parameters: Array<string>
  body: Exp
  location?: SourceLocation
} & DefinitionState

export function FunctionDefinition(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  body: Exp,
  location?: SourceLocation,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    parameters,
    body,
    location,
  }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  mod: Mod
  name: string
  body: Exp
  value?: Value
  location?: SourceLocation
} & DefinitionState

export function VariableDefinition(
  mod: Mod,
  name: string,
  body: Exp,
  location?: SourceLocation,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    mod,
    name,
    body,
    location,
  }
}

export type TestDefinition = {
  kind: "TestDefinition"
  mod: Mod
  name: string
  body: Exp
  value?: Value
  location?: SourceLocation
} & DefinitionState

export function TestDefinition(
  mod: Mod,
  name: string,
  body: Exp,
  location?: SourceLocation,
): TestDefinition {
  return {
    kind: "TestDefinition",
    mod,
    name,
    body,
    location,
  }
}

export type TypeDefinition = {
  kind: "TypeDefinition"
  mod: Mod
  name: string
  parameters: Array<string>
  body: Exp
  value?: Value
  location?: SourceLocation
} & DefinitionState

export function TypeDefinition(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  body: Exp,
  location?: SourceLocation,
): TypeDefinition {
  return {
    kind: "TypeDefinition",
    mod,
    name,
    parameters,
    body,
    location,
  }
}

export type DataDefinition = {
  kind: "DataDefinition"
  mod: Mod
  name: string
  dataTypeConstructor: DataTypeConstructor
  dataConstructors: Array<DataConstructor>
  location?: SourceLocation
} & DefinitionState

export type DataTypeConstructor = {
  definition: DataDefinition
  name: string
  parameters: Array<string>
  location?: SourceLocation
}

export type DataConstructor = {
  definition: DataDefinition
  name: string
  fields: Array<DataField>
  location?: SourceLocation
}

export function dataConstructorEqual(
  x: DataConstructor,
  y: DataConstructor,
): boolean {
  return x.definition === y.definition && x.name === y.name
}

export type DataField = {
  name: string
  type: Exp
  location?: SourceLocation
}

export function DataDefinition(
  mod: Mod,
  name: string,
  dataTypeConstructor: DataTypeConstructor,
  dataConstructors: Array<DataConstructor>,
  location?: SourceLocation,
): DataDefinition {
  return {
    kind: "DataDefinition",
    mod,
    name,
    dataTypeConstructor,
    dataConstructors,
    location,
  }
}

export type InterfaceDefinition = {
  kind: "InterfaceDefinition"
  mod: Mod
  name: string
  interfaceConstructor: InterfaceConstructor
  attributeTypes: Record<string, Exp>
  location?: SourceLocation
} & DefinitionState

export type InterfaceConstructor = {
  definition: InterfaceDefinition
  name: string
  parameters: Array<string>
}

export function InterfaceDefinition(
  mod: Mod,
  name: string,
  interfaceConstructor: InterfaceConstructor,
  attributeTypes: Record<string, Exp>,
  location?: SourceLocation,
): InterfaceDefinition {
  return {
    kind: "InterfaceDefinition",
    mod,
    name,
    interfaceConstructor,
    attributeTypes,
    location,
  }
}
