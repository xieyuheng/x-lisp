import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export type Stmt<E> =
  | ImportStmt
  | ImportAsStmt
  | ImportAllStmt
  | DefineFunctionStmt<E>
  | DefineVariableStmt<E>
  | DefineTestStmt<E>
  | DefineTypeStmt<E>
  | DefineEnumStmt<E>
  | DefineAlgebraicTypeStmt<E>
  | DefineStructStmt<E>
  | DefineStructStarStmt<E>
  | DefineRecordTypeStmt<E>
  | DefineOpaqueTypeStmt<E>
  | ClaimStmt<E>
  | ClaimTypeStmt
  | AdmitStmt<E>
  | PrivateStmt
  | ExemptStmt
  | DeclareModuleStmt
  | DeclarePrimitiveFunctionStmt
  | DeclarePrimitiveVariableStmt

export type ImportStmt = {
  kind: "ImportStmt"
  modName: string
  names: Array<string>
  location: SourceLocation
}

export function ImportStmt(
  modName: string,
  names: Array<string>,
  location: SourceLocation,
): ImportStmt {
  return {
    kind: "ImportStmt",
    modName,
    names,
    location,
  }
}

export type ImportAsStmt = {
  kind: "ImportAsStmt"
  modName: string
  prefix: string
  location: SourceLocation
}

export function ImportAsStmt(
  modName: string,
  prefix: string,
  location: SourceLocation,
): ImportAsStmt {
  return {
    kind: "ImportAsStmt",
    modName,
    prefix,
    location,
  }
}

export type ImportAllStmt = {
  kind: "ImportAllStmt"
  modName: string
  location: SourceLocation
}

export function ImportAllStmt(
  modName: string,
  location: SourceLocation,
): ImportAllStmt {
  return {
    kind: "ImportAllStmt",
    modName,
    location,
  }
}

export type DefineFunctionStmt<E> = {
  kind: "DefineFunctionStmt"
  name: string
  parameters: Array<string>
  body: E
  location: SourceLocation
}

export function DefineFunctionStmt<E>(
  name: string,
  parameters: Array<string>,
  body: E,
  location: SourceLocation,
): DefineFunctionStmt<E> {
  return {
    kind: "DefineFunctionStmt",
    name,
    parameters,
    body,
    location,
  }
}

export type DefineVariableStmt<E> = {
  kind: "DefineVariableStmt"
  name: string
  body: E
  location: SourceLocation
}

export function DefineVariableStmt<E>(
  name: string,
  body: E,
  location: SourceLocation,
): DefineVariableStmt<E> {
  return {
    kind: "DefineVariableStmt",
    name,
    body,
    location,
  }
}

export type DefineTestStmt<E> = {
  kind: "DefineTestStmt"
  name: string
  body: E
  location: SourceLocation
}

export function DefineTestStmt<E>(
  name: string,
  body: E,
  location: SourceLocation,
): DefineTestStmt<E> {
  return {
    kind: "DefineTestStmt",
    name,
    body,
    location,
  }
}

export type DefineTypeStmt<E> = {
  kind: "DefineTypeStmt"
  name: string
  parameters: Array<string>
  body: E
  location: SourceLocation
}

export function DefineTypeStmt<E>(
  name: string,
  parameters: Array<string>,
  body: E,
  location: SourceLocation,
): DefineTypeStmt<E> {
  return {
    kind: "DefineTypeStmt",
    name,
    parameters,
    body,
    location,
  }
}

export type DefineEnumStmt<E> = {
  kind: "DefineEnumStmt"
  typeConstructor: M.TypeConstructor
  dataConstructors: Array<PreDataConstructor>
  location: SourceLocation
}

export function DefineEnumStmt<E>(
  typeConstructor: M.TypeConstructor,
  dataConstructors: Array<PreDataConstructor>,
  location: SourceLocation,
): DefineEnumStmt<E> {
  return {
    kind: "DefineEnumStmt",
    typeConstructor,
    dataConstructors,
    location,
  }
}

export type DefineStructStarStmt<E> = {
  kind: "DefineStructStarStmt"
  typeConstructor: M.TypeConstructor
  dataConstructor: PreDataConstructor
  location: SourceLocation
}

export function DefineStructStarStmt<E>(
  typeConstructor: M.TypeConstructor,
  dataConstructor: PreDataConstructor,
  location: SourceLocation,
): DefineStructStarStmt<E> {
  return {
    kind: "DefineStructStarStmt",
    typeConstructor,
    dataConstructor,
    location,
  }
}

export type DefineStructStmt<E> = {
  kind: "DefineStructStmt"
  typeConstructor: M.TypeConstructor
  fields: Array<PreDataField>
  location: SourceLocation
}

export function DefineStructStmt<E>(
  typeConstructor: M.TypeConstructor,
  fields: Array<PreDataField>,
  location: SourceLocation,
): DefineStructStmt<E> {
  return {
    kind: "DefineStructStmt",
    typeConstructor,
    fields,
    location,
  }
}

export type PreDataConstructor = {
  name: string
  fields: Array<PreDataField>
  location: SourceLocation
}

export type PreDataField = {
  name: string
  type: M.Exp
  location: SourceLocation
}

export type DefineRecordTypeStmt<E> = {
  kind: "DefineRecordTypeStmt"
  typeConstructor: M.TypeConstructor
  dataConstructor: AlgebraicTypeConstructor<E>
  location: SourceLocation
}

export function DefineRecordTypeStmt<E>(
  typeConstructor: M.TypeConstructor,
  dataConstructor: AlgebraicTypeConstructor<E>,
  location: SourceLocation,
): DefineRecordTypeStmt<E> {
  return {
    kind: "DefineRecordTypeStmt",
    typeConstructor,
    dataConstructor,
    location,
  }
}

export type DefineOpaqueTypeStmt<E> = {
  kind: "DefineOpaqueTypeStmt"
  name: string
  parameters: Array<string>
  representationType: E
  interfaceFunctions: Array<{
    name: string
    type: E
    location: SourceLocation
  }>
  location: SourceLocation
}

export function DefineOpaqueTypeStmt<E>(
  name: string,
  parameters: Array<string>,
  representationType: E,
  interfaceFunctions: Array<{
    name: string
    type: E
    location: SourceLocation
  }>,
  location: SourceLocation,
): DefineOpaqueTypeStmt<E> {
  return {
    kind: "DefineOpaqueTypeStmt",
    name,
    parameters,
    representationType,
    interfaceFunctions,
    location,
  }
}

export type AlgebraicTypeField<E> = {
  name: string
  type: E
  accessorName: string
  modifierName?: string
  location: SourceLocation
}

export type AlgebraicTypeConstructor<E> = {
  name: string
  fields: Array<AlgebraicTypeField<E>>
  predicate: string
  location: SourceLocation
}

export type DefineAlgebraicTypeStmt<E> = {
  kind: "DefineAlgebraicTypeStmt"
  typeConstructor: M.TypeConstructor
  dataConstructors: Array<AlgebraicTypeConstructor<E>>
  location: SourceLocation
}

export function DefineAlgebraicTypeStmt<E>(
  typeConstructor: M.TypeConstructor,
  dataConstructors: Array<AlgebraicTypeConstructor<E>>,
  location: SourceLocation,
): DefineAlgebraicTypeStmt<E> {
  return {
    kind: "DefineAlgebraicTypeStmt",
    typeConstructor,
    dataConstructors,
    location,
  }
}

export type ClaimStmt<E> = {
  kind: "ClaimStmt"
  name: string
  type: E
  location: SourceLocation
}

export function ClaimStmt<E>(
  name: string,
  type: E,
  location: SourceLocation,
): ClaimStmt<E> {
  return {
    kind: "ClaimStmt",
    name,
    type,
    location,
  }
}

export type ClaimTypeStmt = {
  kind: "ClaimTypeStmt"
  name: string
  location: SourceLocation
}

export function ClaimTypeStmt(
  name: string,
  location: SourceLocation,
): ClaimTypeStmt {
  return {
    kind: "ClaimTypeStmt",
    name,
    location,
  }
}

export type AdmitStmt<E> = {
  kind: "AdmitStmt"
  name: string
  type: E
  location: SourceLocation
}

export function AdmitStmt<E>(
  name: string,
  type: E,
  location: SourceLocation,
): AdmitStmt<E> {
  return {
    kind: "AdmitStmt",
    name,
    type,
    location,
  }
}

export type ExemptStmt = {
  kind: "ExemptStmt"
  names: Array<string>
  location: SourceLocation
}

export function ExemptStmt(
  names: Array<string>,
  location: SourceLocation,
): ExemptStmt {
  return {
    kind: "ExemptStmt",
    names,
    location,
  }
}

export type PrivateStmt = {
  kind: "PrivateStmt"
  names: Array<string>
  location: SourceLocation
}

export function PrivateStmt(
  names: Array<string>,
  location: SourceLocation,
): PrivateStmt {
  return {
    kind: "PrivateStmt",
    names,
    location,
  }
}

export type DeclareModuleStmt = {
  kind: "DeclareModuleStmt"
  name: string
  location: SourceLocation
}

export function DeclareModuleStmt(
  name: string,
  location: SourceLocation,
): DeclareModuleStmt {
  return {
    kind: "DeclareModuleStmt",
    name,
    location,
  }
}

export type DeclarePrimitiveFunctionStmt = {
  kind: "DeclarePrimitiveFunctionStmt"
  name: string
  arity: number
  location: SourceLocation
}

export function DeclarePrimitiveFunctionStmt(
  name: string,
  arity: number,
  location: SourceLocation,
): DeclarePrimitiveFunctionStmt {
  return {
    kind: "DeclarePrimitiveFunctionStmt",
    name,
    arity,
    location,
  }
}

export type DeclarePrimitiveVariableStmt = {
  kind: "DeclarePrimitiveVariableStmt"
  name: string
  location: SourceLocation
}

export function DeclarePrimitiveVariableStmt(
  name: string,
  location: SourceLocation,
): DeclarePrimitiveVariableStmt {
  return {
    kind: "DeclarePrimitiveVariableStmt",
    name,
    location,
  }
}
