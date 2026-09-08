import { type FunctionDefinition } from "../definition/Definition.ts"
import { type Exe, type ExeLabel } from "../exe/Exe.ts"
import { nameTableAddName, type NameTable } from "../exe/NameTable.ts"
import { makeAssembleContext } from "./AssembleContext.ts"
import { assembleInstr } from "./assembleInstr.ts"

export function assembleFunction(
  exe: Exe,
  definition: FunctionDefinition,
): void {
  nameTableAddName(exe.nameTable, definition.name)

  const ctx = makeAssembleContext(definition)

  for (const instr of definition.instrs) {
    assembleInstr(exe, ctx, instr)
  }

  const localNames = buildLocalNames(ctx.localIndexMap)
  addNamesToNameTable(exe.nameTable, localNames)

  const labels = buildLabels(ctx.labelOffsetMap)
  addNamesToNameTable(
    exe.nameTable,
    labels.map((label) => label.name),
  )

  exe.functions.push({
    name: definition.name,
    arity: definition.parameters.length,
    localNames,
    labels,
    code: ctx.code,
  })
}

function buildLocalNames(localIndexMap: Map<string, number>): Array<string> {
  return Array.from(localIndexMap.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([name]) => name)
}

function buildLabels(labelOffsetMap: Map<string, number>): Array<ExeLabel> {
  return Array.from(labelOffsetMap.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([name, offset]) => ({ name, offset }))
}

function addNamesToNameTable(nameTable: NameTable, names: Array<string>): void {
  for (const name of names) {
    nameTableAddName(nameTable, name)
  }
}
