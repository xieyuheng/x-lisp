import { type File } from "@xieyuheng/helpers.js/file"
import type { Definition } from "../definition/index.ts"
import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import { type AtomValue } from "./Atom.ts"
import { type HashValue } from "./HashValue.ts"
import { type SetValue } from "./SetValue.ts"

export type Value =
  | AtomValue
  | ListValue
  | RecordValue
  | SetValue
  | HashValue
  | ClosureValue
  | CurryValue
  | DefinitionValue
  | FileValue

export type ListValue = {
  kind: "ListValue"
  elements: Array<Value>
}

export function ListValue(elements: Array<Value>): ListValue {
  return {
    kind: "ListValue",
    elements,
  }
}

export function isListValue(value: Value): value is ListValue {
  return value.kind === "ListValue"
}

export function asListValue(value: Value): ListValue {
  if (isListValue(value)) return value
  throw new Error(`[asListValue] fail on: ${formatValue(value)}`)
}

export type RecordValue = {
  kind: "RecordValue"
  attributes: Record<string, Value>
}

export function RecordValue(attributes: Record<string, Value>): RecordValue {
  return {
    kind: "RecordValue",
    attributes,
  }
}

export function isRecordValue(value: Value): value is RecordValue {
  return value.kind === "RecordValue"
}

export function asRecordValue(value: Value): RecordValue {
  if (isRecordValue(value)) return value
  throw new Error(`[asRecordValue] fail on: ${formatValue(value)}`)
}

export type ClosureValue = {
  kind: "ClosureValue"
  mod: Mod
  env: Env
  parameters: Array<string>
  body: Exp
}

export function ClosureValue(
  mod: Mod,
  env: Env,
  parameters: Array<string>,
  body: Exp,
): ClosureValue {
  return {
    kind: "ClosureValue",
    mod,
    env,
    parameters,
    body,
  }
}

export function isClosureValue(value: Value): value is ClosureValue {
  return value.kind === "ClosureValue"
}

export function asClosureValue(value: Value): ClosureValue {
  if (isClosureValue(value)) return value
  throw new Error(`[asClosureValue] fail on: ${formatValue(value)}`)
}

export type CurryValue = {
  kind: "CurryValue"
  target: Value
  arity: number
  args: Array<Value>
}

export function CurryValue(
  target: Value,
  arity: number,
  args: Array<Value>,
): CurryValue {
  return {
    kind: "CurryValue",
    target,
    arity,
    args,
  }
}

export type DefinitionValue = {
  kind: "DefinitionValue"
  definition: Definition
}

export function DefinitionValue(definition: Definition): DefinitionValue {
  return {
    kind: "DefinitionValue",
    definition,
  }
}

export function isDefinitionValue(value: Value): value is DefinitionValue {
  return value.kind === "DefinitionValue"
}

export function asDefinitionValue(value: Value): DefinitionValue {
  if (isDefinitionValue(value)) return value
  throw new Error(`[asDefinitionValue] fail on: ${formatValue(value)}`)
}

export type FileValue = {
  kind: "FileValue"
  file: File
}

export function FileValue(file: File): FileValue {
  return {
    kind: "FileValue",
    file,
  }
}

export function isFileValue(value: Value): value is FileValue {
  return value.kind === "FileValue"
}

export function asFileValue(value: Value): FileValue {
  if (isFileValue(value)) return value
  throw new Error(`[asFileValue] fail on: ${formatValue(value)}`)
}
