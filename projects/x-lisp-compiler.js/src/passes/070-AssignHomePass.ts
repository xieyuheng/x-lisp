import * as S from "@xieyuheng/sexp.js"
import * as M from "../machine/index.ts"
import { getVarNames } from "./069-SetupVariableInfo.ts"

export function AssignHomePass(mod: M.Mod): void {
  for (const definition of M.modDefinitions(mod)) {
    onDefinition(definition)
  }
}

type Info = {
  "home-locations": Map<string, M.Operand>
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "CodeDefinition": {
      const info = { "home-locations": getHomeLocations(definition) }
      definition.info = { ...definition.info, ...info }

      const blocks = Array.from(definition.blocks.values())
      for (const block of blocks) {
        definition.blocks.set(block.label, onBlock(info, block))
      }

      return null
    }

    case "DataDefinition": {
      return null
    }

    case "SpaceDefinition": {
      return null
    }
  }
}

function getHomeLocations(
  definition: M.CodeDefinition,
): Map<string, M.Operand> {
  const homeLocations = new Map()
  for (const name of getVarNames(definition)) {
    const found = homeLocations.get(name)
    if (found === undefined) {
      const baseIndex = 0
      const index = baseIndex + homeLocations.size
      const offset = -8 * (index + 1)
      const location = M.RegDeref(M.Reg("rbp"), offset)
      homeLocations.set(name, location)
    }
  }

  return homeLocations
}

function onBlock(info: Info, block: M.Block): M.Block {
  return M.Block(
    block.label,
    block.instrs.map((instr) => onInstr(info, instr)),
    block.meta,
  )
}

function onInstr(info: Info, instr: M.Instr): M.Instr {
  return M.Instr(
    instr.op,
    instr.operands.map((operand) => onOperand(info, operand)),
    instr.meta,
  )
}

function onOperand(info: Info, operand: M.Operand): M.Operand {
  if (operand.kind === "Var") {
    const location = info["home-locations"].get(operand.name)
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
