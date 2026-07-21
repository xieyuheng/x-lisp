import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export type Definition =
  | PrimitiveFunctionDeclaration
  | PrimitiveVariableDeclaration
  | FunctionDefinition
  | VariableDefinition
  | TestDefinition
  | TypeDefinition
  | AlgebraicTypeDefinition
  | OpaqueTypeDefinition

export type PrimitiveFunctionDeclaration = {
  kind: "PrimitiveFunctionDeclaration"
  mod: M.Mod
  name: string
  arity: number
  location: SourceLocation
}

export function PrimitiveFunctionDeclaration(
  mod: M.Mod,
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
  mod: M.Mod
  name: string
  location: SourceLocation
}

export function PrimitiveVariableDeclaration(
  mod: M.Mod,
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
  mod: M.Mod
  name: string
  parameters: Array<string>
  body: M.Term
  varTypes: Map<string, M.Type>
  location: SourceLocation
}

export function FunctionDefinition(
  mod: M.Mod,
  name: string,
  parameters: Array<string>,
  body: M.Term,
  location: SourceLocation,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    parameters,
    body,
    varTypes: new Map(),
    location,
  }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  mod: M.Mod
  name: string
  body: M.Term
  varTypes: Map<string, M.Type>
  location: SourceLocation
}

export function VariableDefinition(
  mod: M.Mod,
  name: string,
  body: M.Term,
  location: SourceLocation,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    mod,
    name,
    body,
    varTypes: new Map(),
    location,
  }
}

export type TestDefinition = {
  kind: "TestDefinition"
  mod: M.Mod
  name: string
  body: M.Term
  varTypes: Map<string, M.Type>
  location: SourceLocation
}

export function TestDefinition(
  mod: M.Mod,
  name: string,
  body: M.Term,
  location: SourceLocation,
): TestDefinition {
  return {
    kind: "TestDefinition",
    mod,
    name,
    body,
    varTypes: new Map(),
    location,
  }
}

export type TypeDefinition = {
  kind: "TypeDefinition"
  mod: M.Mod
  name: string
  parameters: Array<string>
  body: M.Term
  varTypes: Map<string, M.Type>
  location: SourceLocation
}

export function TypeDefinition(
  mod: M.Mod,
  name: string,
  parameters: Array<string>,
  body: M.Term,
  location: SourceLocation,
): TypeDefinition {
  return {
    kind: "TypeDefinition",
    mod,
    name,
    parameters,
    body,
    varTypes: new Map(),
    location,
  }
}

export type AlgebraicTypeDefinition = {
  kind: "AlgebraicTypeDefinition"
  mod: M.Mod
  name: string
  typeConstructor: TypeConstructor
  dataConstructors: Array<DataConstructor>
  location: SourceLocation
}

export type TypeConstructor = {
  mod: M.Mod
  name: string
  parameters: Array<string>
  location: SourceLocation
}

export type DataField = {
  name: string
  type: M.Term
  location: SourceLocation
}

export type DataConstructor = {
  mod: M.Mod
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

export function typeConstructorEqual(
  x: TypeConstructor,
  y: TypeConstructor,
): boolean {
  return x.mod === y.mod && x.name === y.name
}

export type InterfaceEntry = {
  name: string
  type: M.Term
  location: SourceLocation
}

export type OpaqueTypeDefinition = {
  kind: "OpaqueTypeDefinition"
  mod: M.Mod
  name: string
  typeConstructor: TypeConstructor
  representationType: M.Term
  interfaceEntries: Array<InterfaceEntry>
  location: SourceLocation
}

export function OpaqueTypeDefinition(
  mod: M.Mod,
  name: string,
  typeConstructor: TypeConstructor,
  representationType: M.Term,
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
  mod: M.Mod,
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
