import { type Definition } from "../definition/Definition.ts"
import { makeEmptyExe, type Exe } from "../exe/Exe.ts"
import { nameTableAddName } from "../exe/NameTable.ts"
import { type Program } from "../program/Program.ts"
import { assembleFunction } from "./assembleFunction.ts"

export function assembleProgram(program: Program): Exe {
  const exe = makeEmptyExe()

  for (const definition of program.definitions.values()) {
    assembleDefinition(exe, definition)
  }

  return exe
}

function assembleDefinition(exe: Exe, definition: Definition): void {
  switch (definition.kind) {
    case "FunctionDefinition": {
      assembleFunction(exe, definition)
      break
    }

    case "VariableDeclaration": {
      nameTableAddName(exe.nameTable, definition.name)
      exe.variables.push({ name: definition.name })
      break
    }

    case "PrimitiveFunctionDeclaration": {
      nameTableAddName(exe.nameTable, definition.name)
      exe.primitiveFunctions.push({ name: definition.name })
      break
    }

    case "PrimitiveVariableDeclaration": {
      nameTableAddName(exe.nameTable, definition.name)
      exe.primitiveVariables.push({ name: definition.name })
      break
    }
  }
}
