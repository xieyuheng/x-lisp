import * as M from "../../machine/index.ts"
import type { Block } from "../block/index.ts"
import type { Definition } from "../definition/index.ts"
import { formatInstr, formatValue } from "../format/index.ts"
import type { Instr } from "../instr/index.ts"
import { modOwnDefinitions, type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function SelectInstructionPass(mod: Mod, machineMod: M.Mod): void {
  for (const definition of modOwnDefinitions(mod)) {
    onDefinition(machineMod, definition)
  }
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
      for (const block of definition.blocks.values()) {
        const machineBlock = onBlock(block)
        code.blocks.set(machineBlock.label, machineBlock)
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

function onBlock(block: Block): M.Block {
  return M.Block(block.label, block.instrs.flatMap(onInstr), block.meta)
}

function onInstr(instr: Instr): Array<M.Instr> {
  switch (instr.op) {
    case "Argument": {
      if (instr.index > 6) {
        let message = `[onInstr] can not handle more then 6 argument yet`
        message += `\n  instr: ${formatInstr(instr)}`
        throw new Error(message)
      }

      return [M.Instr("movq", [selectArgReg(instr.index), M.Var(instr.dest)])]
    }

    case "Const": {
      // TODO use tagged value

      if (Values.isBool(instr.value)) {
        if (Values.isTrue(instr.value)) {
          return [M.Instr("movq", [M.Imm(1), M.Var(instr.dest)])]
        } else {
          return [M.Instr("movq", [M.Imm(0), M.Var(instr.dest)])]
        }
      }

      switch (instr.value.kind) {
        case "Int": {
          return [
            M.Instr("movq", [M.Imm(instr.value.content), M.Var(instr.dest)]),
          ]
        }

        case "PrimitiveFunctionRef":
        case "FunctionRef": {
          return [
            M.Instr("leaq", [
              M.DerefLabel(M.Label(instr.value.name)),
              M.Var(instr.dest),
            ]),
          ]
        }

        default: {
          let message = `[onInstr/Const] unhandled value`
          message += `\n  value: ${formatValue(instr.value)}`
          message += `\n  dest: ${instr.dest}`
          throw new Error(message)
        }
      }
    }

    case "Assert": {
      // TODO
      return []
    }

    case "Return": {
      if (instr.result !== undefined) {
        return [
          M.Instr("movq", [M.Var(instr.result), M.Reg("rax")]),
          M.Instr("retq", []),
        ]
      }

      return [M.Instr("retq", [])]
    }

    case "Goto": {
      return [M.Instr("jmp", [M.Label(instr.label)])]
    }

    case "Branch": {
      // TODO use tagged value
      return [
        M.Instr("cmpq", [M.Var(instr.condition), M.Imm(1)]),
        M.Instr("branch-if", [
          M.Cc("e"),
          M.Label(instr.thenLabel),
          M.Label(instr.elseLabel),
        ]),
      ]
    }

    case "Call": {
      return [
        ...instr.args
          .entries()
          .map(([index, arg]) =>
            M.Instr("movq", [M.Var(arg), selectArgReg(index)]),
          ),
        M.Instr("callq-n", [M.Label(instr.name), M.Arity(instr.args.length)]),
        M.Instr("movq", [M.Reg("rax"), M.Var(instr.dest)]),
      ]
    }

    case "Apply": {
      return [
        M.Instr("movq", [M.Var(instr.target), selectArgReg(0)]),
        M.Instr("movq", [M.Var(instr.arg), selectArgReg(1)]),
        M.Instr("callq-n", [M.Label("apply"), M.Arity(2)]),
        M.Instr("movq", [M.Reg("rax"), M.Var(instr.dest)]),
      ]
    }

    case "NullaryApply": {
      return [
        M.Instr("movq", [M.Var(instr.target), selectArgReg(0)]),
        M.Instr("callq-n", [M.Label("nullary-apply"), M.Arity(1)]),
        M.Instr("movq", [M.Reg("rax"), M.Var(instr.dest)]),
      ]
    }
  }
}

function selectArgReg(index: number): M.Reg {
  const argRegName = M.ABIs["x86-64-sysv"]["argument-reg-names"][index]
  return M.Reg(argRegName)
}
