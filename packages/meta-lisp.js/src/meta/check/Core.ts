import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export type Core =
  | VarCore
  | QualifiedVarCore
  | LambdaCore
  | ApplyCore
  | Let1Core
  | Begin1Core
  | IfCore
  | IntCore
  | FloatCore
  | StringCore
  | SymbolCore
  | KeywordCore

export type VarCore = {
  kind: "VarCore"
  name: string
  type: M.Type
  location: SourceLocation
}

export type QualifiedVarCore = {
  kind: "QualifiedVarCore"
  pkgName: string
  modName: string
  name: string
  type: M.Type
  location: SourceLocation
}

export type LambdaCore = {
  kind: "LambdaCore"
  parameters: Array<{ name: string; type: M.Type }>
  body: Core
  type: M.Type
  location: SourceLocation
}

export type ApplyCore = {
  kind: "ApplyCore"
  target: Core
  args: Array<Core>
  type: M.Type
  location: SourceLocation
}

export type Let1Core = {
  kind: "Let1Core"
  name: string
  rhs: Core
  body: Core
  type: M.Type
  location: SourceLocation
}

export type Begin1Core = {
  kind: "Begin1Core"
  head: Core
  body: Core
  type: M.Type
  location: SourceLocation
}

export type IfCore = {
  kind: "IfCore"
  condition: Core
  consequent: Core
  alternative: Core
  type: M.Type
  location: SourceLocation
}

export type IntCore = {
  kind: "IntCore"
  content: bigint
  type: M.Type
  location: SourceLocation
}

export type FloatCore = {
  kind: "FloatCore"
  content: number
  type: M.Type
  location: SourceLocation
}

export type StringCore = {
  kind: "StringCore"
  content: string
  type: M.Type
  location: SourceLocation
}

export type SymbolCore = {
  kind: "SymbolCore"
  content: string
  type: M.Type
  location: SourceLocation
}

export type KeywordCore = {
  kind: "KeywordCore"
  content: string
  type: M.Type
  location: SourceLocation
}

export function VarCore(
  name: string,
  type: M.Type,
  location: SourceLocation,
): VarCore {
  return { kind: "VarCore", name, type, location }
}

export function QualifiedVarCore(
  pkgName: string,
  modName: string,
  name: string,
  type: M.Type,
  location: SourceLocation,
): QualifiedVarCore {
  return { kind: "QualifiedVarCore", pkgName, modName, name, type, location }
}

export function LambdaCore(
  parameters: Array<{ name: string; type: M.Type }>,
  body: Core,
  type: M.Type,
  location: SourceLocation,
): LambdaCore {
  return { kind: "LambdaCore", parameters, body, type, location }
}

export function ApplyCore(
  target: Core,
  args: Array<Core>,
  type: M.Type,
  location: SourceLocation,
): ApplyCore {
  return { kind: "ApplyCore", target, args, type, location }
}

export function Let1Core(
  name: string,
  rhs: Core,
  body: Core,
  type: M.Type,
  location: SourceLocation,
): Let1Core {
  return { kind: "Let1Core", name, rhs, body, type, location }
}

export function Begin1Core(
  head: Core,
  body: Core,
  type: M.Type,
  location: SourceLocation,
): Begin1Core {
  return { kind: "Begin1Core", head, body, type, location }
}

export function IfCore(
  condition: Core,
  consequent: Core,
  alternative: Core,
  type: M.Type,
  location: SourceLocation,
): IfCore {
  return { kind: "IfCore", condition, consequent, alternative, type, location }
}

export function IntCore(
  content: bigint,
  type: M.Type,
  location: SourceLocation,
): IntCore {
  return { kind: "IntCore", content, type, location }
}

export function FloatCore(
  content: number,
  type: M.Type,
  location: SourceLocation,
): FloatCore {
  return { kind: "FloatCore", content, type, location }
}

export function StringCore(
  content: string,
  type: M.Type,
  location: SourceLocation,
): StringCore {
  return { kind: "StringCore", content, type, location }
}

export function SymbolCore(
  content: string,
  type: M.Type,
  location: SourceLocation,
): SymbolCore {
  return { kind: "SymbolCore", content, type, location }
}

export function KeywordCore(
  content: string,
  type: M.Type,
  location: SourceLocation,
): KeywordCore {
  return { kind: "KeywordCore", content, type, location }
}
