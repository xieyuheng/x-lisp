export type Exe = {
  nameTable: NameTable
  functions: Array<ExeFunctionDefinition>
  variables: Array<ExeVariableDeclaration>
  primitiveFunctions: Array<ExePrimitiveFunctionDeclaration>
  primitiveVariables: Array<ExePrimitiveVariableDeclaration>
  functionFixupTable: FunctionFixupTable
}

export type NameTable = {
  names: Array<string>
  offsets: Map<string, number>
}

export type ExeFunctionDefinition = {
  name: string
  arity: number
  localCount: number
  code: Uint8Array
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

export type FixupType =
  | "string-value"
  | "symbol-value"
  | "fn-pointer"
  | "prim-pointer"
  | "global-pointer"

export type FunctionFixup = {
  type: FixupType
  name: string
  destName: string
  destOffset: number
}

export type FunctionFixupTable = {
  fixups: Array<FunctionFixup>
}