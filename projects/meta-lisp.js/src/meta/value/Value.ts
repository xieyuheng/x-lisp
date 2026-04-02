import type { Definition } from "../definition/index.ts"
import { type File } from "@xieyuheng/helpers.js/file"
import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type AtomValue } from "./Atom.ts"
import { type HashValue } from "./Hash.ts"
import { type SetValue } from "./Set.ts"
import { formatValue } from "../format/index.ts"

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
  throw new Error(`[asFloatValue] fail on: ${formatValue(value)}`)
}
