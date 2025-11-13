import * as M from "../../machine/index.ts"
import type { Block } from "../block/index.ts"
import type { Definition } from "../definition/index.ts"
import type { Instr } from "../instr/index.ts"
import { modOwnDefinitions, type Mod } from "../mod/index.ts"

export function SelectInstructionPass(mod: Mod, machineMod: M.Mod): void {
  for (const definition of modOwnDefinitions(mod)) {
     onDefinition(machineMod, definition)
  }
}

type State = {
  code: M.CodeDefinition
}

function onDefinition(machineMod: M.Mod, definition: Definition): null {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const code = M.CodeDefinition(
        machineMod,
        definition.name,
        new Map(),
        definition.meta,
      )
      machineMod.definitions.set(code.name, code)
      const state = { code }
      for (const block of definition.blocks.values()) {
        onBlock(state, block)
      }
      return null
    }

    default: {
      let message = `[onDefinition] unhandled definition`
      message += `\n  definition kind: ${definition.kind}`
      throw new Error(message)
    }
  }
}

function onBlock(state: State, block: Block): void {
  const machineBlock = M.Block(
    block.label,
    block.instrs.flatMap((instr) => onInstr(state, instr)),
    block.meta,
  )
  state.code.blocks.set(machineBlock.label, machineBlock)
}

function onInstr(state: State, instr: Instr): Array<M.Instr> {
  switch (instr.op) {
    case "Argument": {
      // return `(= ${instr.dest} (argument ${instr.index}))`

      // TODO
      return []
    }

    case "Const": {
      // return `(= ${instr.dest} (const ${formatValue(instr.value)}))`

      // TODO
      return []
    }

    case "Assert": {
      // TODO
      return []
    }

    case "Return": {
      if (instr.result !== undefined) {
        return [M.Instr("ret", [M.Var(instr.result)])]
      }

      return [M.Instr("ret", [])]
    }

    case "Goto": {
      // return `(goto ${instr.label})`

      // TODO
      return []
    }

    case "Branch": {
      // return `(branch ${instr.condition} ${instr.thenLabel} ${instr.elseLabel})`

      // TODO
      return []
    }

    case "Call": {
      // const args = instr.args.join(" ")
      // const rhs =
      //   args === "" ? `(call ${instr.name})` : `(call ${instr.name} ${args})`
      // return instr.dest ? `(= ${instr.dest} ${rhs})` : rhs

      // TODO
      return []
    }

    case "Apply": {
      // const rhs = `(apply ${instr.target} ${instr.arg})`
      // return instr.dest ? `(= ${instr.dest} ${rhs})` : rhs

      // TODO
      return []
    }

    case "NullaryApply": {
      // const rhs = `(nullary-apply ${instr.target})`
      // return instr.dest ? `(= ${instr.dest} ${rhs})` : rhs

      // TODO
      return []
    }
  }
}
