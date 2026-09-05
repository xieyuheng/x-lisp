import {
  PrimitiveFunctionDeclaration,
  PrimitiveVariableDeclaration,
  VariableDeclaration,
} from "../definition/Definition.ts"
import { type Exe } from "../exe/Exe.ts"
import { createProgram, type Program } from "../program/Program.ts"
import { disassembleFunction } from "./disassembleFunction.ts"

export function disassembleExe(exe: Exe): Program {
  const program = createProgram()

  for (const variable of exe.variables) {
    program.definitions.set(variable.name, VariableDeclaration(variable.name))
  }

  for (const primitive of exe.primitiveFunctions) {
    program.definitions.set(
      primitive.name,
      PrimitiveFunctionDeclaration(primitive.name),
    )
  }

  for (const primitive of exe.primitiveVariables) {
    program.definitions.set(
      primitive.name,
      PrimitiveVariableDeclaration(primitive.name),
    )
  }

  for (const fn of exe.functions) {
    program.definitions.set(fn.name, disassembleFunction(exe, fn))
  }

  return program
}
