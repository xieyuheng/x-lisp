import { type SourceLocation } from "@xieyuheng/sexp.js"
import type {
  DataField,
  PreDataConstructor,
  TypeConstructor,
} from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"

export type Stmt =
  | ImportStmt
  | ImportAsStmt
  | ImportAllStmt
  | DefineFunctionStmt
  | DefineVariableStmt
  | DefineTestStmt
  | DefineTypeStmt
  | DefineEnumStmt
  | DefineAlgebraicTypeStmt
  | DefineStructStmt
  | DefineStructStarStmt
  | DefineRecordTypeStmt
  | DefineOpaqueTypeStmt
  | ClaimStmt
  | ClaimTypeStmt
  | AdmitStmt
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

export type DefineFunctionStmt = {
  kind: "DefineFunctionStmt"
  name: string
  parameters: Array<string>
  body: Exp
  location: SourceLocation
}

export function DefineFunctionStmt(
  name: string,
  parameters: Array<string>,
  body: Exp,
  location: SourceLocation,
): DefineFunctionStmt {
  return {
    kind: "DefineFunctionStmt",
    name,
    parameters,
    body,
    location,
  }
}

export type DefineVariableStmt = {
  kind: "DefineVariableStmt"
  name: string
  body: Exp
  location: SourceLocation
}

export function DefineVariableStmt(
  name: string,
  body: Exp,
  location: SourceLocation,
): DefineVariableStmt {
  return {
    kind: "DefineVariableStmt",
    name,
    body,
    location,
  }
}

export type DefineTestStmt = {
  kind: "DefineTestStmt"
  name: string
  body: Exp
  location: SourceLocation
}

export function DefineTestStmt(
  name: string,
  body: Exp,
  location: SourceLocation,
): DefineTestStmt {
  return {
    kind: "DefineTestStmt",
    name,
    body,
    location,
  }
}

export type DefineTypeStmt = {
  kind: "DefineTypeStmt"
  name: string
  parameters: Array<string>
  body: Exp
  location: SourceLocation
}

export function DefineTypeStmt(
  name: string,
  parameters: Array<string>,
  body: Exp,
  location: SourceLocation,
): DefineTypeStmt {
  return {
    kind: "DefineTypeStmt",
    name,
    parameters,
    body,
    location,
  }
}

export type DefineEnumStmt = {
  kind: "DefineEnumStmt"
  typeConstructor: TypeConstructor
  dataConstructors: Array<PreDataConstructor>
  location: SourceLocation
}

export function DefineEnumStmt(
  typeConstructor: TypeConstructor,
  dataConstructors: Array<PreDataConstructor>,
  location: SourceLocation,
): DefineEnumStmt {
  return {
    kind: "DefineEnumStmt",
    typeConstructor,
    dataConstructors,
    location,
  }
}

export type DefineStructStarStmt = {
  kind: "DefineStructStarStmt"
  typeConstructor: TypeConstructor
  dataConstructor: PreDataConstructor
  location: SourceLocation
}

export function DefineStructStarStmt(
  typeConstructor: TypeConstructor,
  dataConstructor: PreDataConstructor,
  location: SourceLocation,
): DefineStructStarStmt {
  return {
    kind: "DefineStructStarStmt",
    typeConstructor,
    dataConstructor,
    location,
  }
}

export type DefineStructStmt = {
  kind: "DefineStructStmt"
  typeConstructor: TypeConstructor
  fields: Array<DataField>
  location: SourceLocation
}

export function DefineStructStmt(
  typeConstructor: TypeConstructor,
  fields: Array<DataField>,
  location: SourceLocation,
): DefineStructStmt {
  return {
    kind: "DefineStructStmt",
    typeConstructor,
    fields,
    location,
  }
}

export type DefineRecordTypeStmt = {
  kind: "DefineRecordTypeStmt"
  typeConstructor: TypeConstructor
  dataConstructor: AlgebraicTypeConstructor
  location: SourceLocation
}

export function DefineRecordTypeStmt(
  typeConstructor: TypeConstructor,
  dataConstructor: AlgebraicTypeConstructor,
  location: SourceLocation,
): DefineRecordTypeStmt {
  return {
    kind: "DefineRecordTypeStmt",
    typeConstructor,
    dataConstructor,
    location,
  }
}

export type DefineOpaqueTypeStmt = {
  kind: "DefineOpaqueTypeStmt"
  name: string
  parameters: Array<string>
  representationType: Exp
  interfaceFunctions: Array<{
    name: string
    type: Exp
    location: SourceLocation
  }>
  location: SourceLocation
}

export function DefineOpaqueTypeStmt(
  name: string,
  parameters: Array<string>,
  representationType: Exp,
  interfaceFunctions: Array<{
    name: string
    type: Exp
    location: SourceLocation
  }>,
  location: SourceLocation,
): DefineOpaqueTypeStmt {
  return {
    kind: "DefineOpaqueTypeStmt",
    name,
    parameters,
    representationType,
    interfaceFunctions,
    location,
  }
}

export type AlgebraicTypeField = {
  name: string
  type: Exp
  accessorName: string
  modifierName?: string
  location: SourceLocation
}

export type AlgebraicTypeConstructor = {
  name: string
  fields: Array<AlgebraicTypeField>
  predicate: string
  location: SourceLocation
}

export type DefineAlgebraicTypeStmt = {
  kind: "DefineAlgebraicTypeStmt"
  typeConstructor: TypeConstructor
  dataConstructors: Array<AlgebraicTypeConstructor>
  location: SourceLocation
}

export function DefineAlgebraicTypeStmt(
  typeConstructor: TypeConstructor,
  dataConstructors: Array<AlgebraicTypeConstructor>,
  location: SourceLocation,
): DefineAlgebraicTypeStmt {
  return {
    kind: "DefineAlgebraicTypeStmt",
    typeConstructor,
    dataConstructors,
    location,
  }
}

export type ClaimStmt = {
  kind: "ClaimStmt"
  name: string
  type: Exp
  location: SourceLocation
}

export function ClaimStmt(
  name: string,
  type: Exp,
  location: SourceLocation,
): ClaimStmt {
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

export type AdmitStmt = {
  kind: "AdmitStmt"
  name: string
  type: Exp
  location: SourceLocation
}

export function AdmitStmt(
  name: string,
  type: Exp,
  location: SourceLocation,
): AdmitStmt {
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
