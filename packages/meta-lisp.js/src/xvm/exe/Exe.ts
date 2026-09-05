import { type FunctionFixupTable } from "./FunctionFixupTable.ts"
import { makeEmptyNameTable, type NameTable } from "./NameTable.ts"

export * from "./FunctionFixupTable.ts"
export * from "./NameTable.ts"

export type Exe = {
  nameTable: NameTable
  functions: Array<ExeFunctionDefinition>
  variables: Array<ExeVariableDeclaration>
  primitiveFunctions: Array<ExePrimitiveFunctionDeclaration>
  primitiveVariables: Array<ExePrimitiveVariableDeclaration>
  functionFixupTable: FunctionFixupTable
}

export type ExeFunctionDefinition = {
  name: string
  arity: number
  localNames: Array<string>
  labels: Array<ExeLabel>
  code: Uint8Array
}

export type ExeLabel = {
  name: string
  offset: number
}

export type ExeVariableDeclaration = {
  name: string
}

export type ExePrimitiveFunctionDeclaration = {
  name: string
}

export type ExePrimitiveVariableDeclaration = {
  name: string
}

export const ExeTags = {
  NameTable: 0x01,
  FunctionDefinition: 0x10,
  VariableDeclaration: 0x11,
  PrimitiveFunctionDeclaration: 0x12,
  PrimitiveVariableDeclaration: 0x13,
  FunctionFixupTable: 0x14,
} as const

export function makeEmptyExe(): Exe {
  return {
    nameTable: makeEmptyNameTable(),
    functions: [],
    variables: [],
    primitiveFunctions: [],
    primitiveVariables: [],
    functionFixupTable: {
      fixups: [],
    },
  }
}
