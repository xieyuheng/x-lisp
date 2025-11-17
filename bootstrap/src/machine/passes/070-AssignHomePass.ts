import * as S from "@xieyuheng/x-sexp.js"
import * as M from "../../machine/index.ts"

export function AssignHomePass(mod: M.Mod): void {
  for (const definition of M.modDefinitions(mod)) {
    onDefinition(definition)
  }
}

type Context = {
  locationMap: Map<string, M.Operand>
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = Array.from(definition.blocks.values())
      for (const block of blocks) {
        const locationMap = createLocationMap(definition)
        const context: Context = { locationMap }
        definition.blocks.set(block.label, onBlock(context, block))
      }

      return null
    }

    case "DataDefinition": {
      return null
    }
  }
}

export function createLocationMap(
  definition: M.CodeDefinition,
): Map<string, M.Operand> {
  const locationMap = new Map()
  for (const block of definition.blocks.values()) {
    for (const instr of block.instrs) {
      for (const operand of instr.operands) {
        if (operand.kind === "Var") {
          const found = locationMap.get(operand.name)
          if (found === undefined) {
            const baseIndex =
              M.ABIs["x86-64-sysv"]["callee-saved-reg-names"].length
            const index = baseIndex + locationMap.size
            const offset = -8 * (index + 1)
            const location = M.RegDeref(M.Reg("rbp"), offset, operand.meta)
            locationMap.set(operand.name, location)
          }
        }
      }
    }
  }

  return locationMap
}

function onBlock(context: Context, block: M.Block): M.Block {
  return M.Block(
    block.label,
    block.instrs.map((instr) => onInstr(context, instr)),
    block.meta,
  )
}

function onInstr(context: Context, instr: M.Instr): M.Instr {
  return M.Instr(
    instr.op,
    instr.operands.map((operand) => onOperand(context, operand)),
    instr.meta,
  )
}

function onOperand(context: Context, operand: M.Operand): M.Operand {
  if (operand.kind === "Var") {
    const location = context.locationMap.get(operand.name)
    if (location === undefined) {
      let message = `[onOperand] undefined location`
      message += `\n  name: ${operand.name}`
      if (operand.meta) throw new S.ErrorWithMeta(message, operand.meta)
      else throw new Error(message, operand.meta)
    }

    return location
  } else {
    return operand
  }
}
