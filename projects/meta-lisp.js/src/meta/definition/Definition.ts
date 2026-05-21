import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Mod } from "../mod/index.ts"
import type { Term } from "../term/Term.ts"
import type { Value } from "../value/Value.ts"

export type Definition =
  | PrimitiveFunctionDefinition
  | PrimitiveVariableDefinition
  | PrimitiveFunctionDeclaration
  | PrimitiveVariableDeclaration
  | FunctionDefinition
  | VariableDefinition
  | TestDefinition
  | TypeDefinition
  | AlgebraicTypeDefinition
  | OpaqueTypeDefinition

export type DefinitionState = {
  isChecked?: boolean
}

export type TypeFunction = (...args: Array<Value>) => Value

export type PrimitiveFunctionDefinition = {
  kind: "PrimitiveFunctionDefinition"
  mod: Mod
  name: string
  arity: number
  fn: TypeFunction
  location: SourceLocation
} & DefinitionState

export function PrimitiveFunctionDefinition(
  mod: Mod,
  name: string,
  arity: number,
  fn: TypeFunction,
  location: SourceLocation,
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
  location: SourceLocation
} & DefinitionState

export function PrimitiveVariableDefinition(
  mod: Mod,
  name: string,
  value: Value,
  location: SourceLocation,
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
  location: SourceLocation
} & DefinitionState

export function PrimitiveFunctionDeclaration(
  mod: Mod,
  name: string,
  arity: number,
  location: SourceLocation,
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
  location: SourceLocation
} & DefinitionState

export function PrimitiveVariableDeclaration(
  mod: Mod,
  name: string,
  location: SourceLocation,
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
  body: Term
  location: SourceLocation
} & DefinitionState

export function FunctionDefinition(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  body: Term,
  location: SourceLocation,
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
  body: Term
  location: SourceLocation
} & DefinitionState

export function VariableDefinition(
  mod: Mod,
  name: string,
  body: Term,
  location: SourceLocation,
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
  body: Term
  location: SourceLocation
} & DefinitionState

export function TestDefinition(
  mod: Mod,
  name: string,
  body: Term,
  location: SourceLocation,
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
  body: Term
  location: SourceLocation
} & DefinitionState

export function TypeDefinition(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  body: Term,
  location: SourceLocation,
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

export type AlgebraicTypeDefinition = {
  kind: "AlgebraicTypeDefinition"
  mod: Mod
  name: string
  typeConstructor: TypeConstructor
  dataConstructors: Array<DataConstructor>
  location: SourceLocation
} & DefinitionState

export type TypeConstructor = {
  name: string
  parameters: Array<string>
  location: SourceLocation
}

export type DataField = {
  name: string
  type: Term
  location: SourceLocation
}

export type DataConstructor = {
  mod: Mod
  typeName: string
  name: string
  fields: Array<DataField>
  location: SourceLocation
}

export function dataConstructorEqual(
  x: DataConstructor,
  y: DataConstructor,
): boolean {
  return x.mod === y.mod && x.typeName === y.typeName && x.name === y.name
}

export type InterfaceEntry = {
  name: string
  type: Term
  location: SourceLocation
}

export type OpaqueTypeDefinition = {
  kind: "OpaqueTypeDefinition"
  mod: Mod
  name: string
  typeConstructor: TypeConstructor
  representationType: Term
  interfaceEntries: Array<InterfaceEntry>
  location: SourceLocation
} & DefinitionState

export function OpaqueTypeDefinition(
  mod: Mod,
  name: string,
  typeConstructor: TypeConstructor,
  representationType: Term,
  interfaceEntries: Array<InterfaceEntry>,
  location: SourceLocation,
): OpaqueTypeDefinition {
  return {
    kind: "OpaqueTypeDefinition",
    mod,
    name,
    typeConstructor,
    representationType,
    interfaceEntries,
    location,
  }
}

export function AlgebraicTypeDefinition(
  mod: Mod,
  name: string,
  typeConstructor: TypeConstructor,
  dataConstructors: Array<DataConstructor>,
  location: SourceLocation,
): AlgebraicTypeDefinition {
  return {
    kind: "AlgebraicTypeDefinition",
    mod,
    name,
    typeConstructor,
    dataConstructors,
    location,
  }
}
