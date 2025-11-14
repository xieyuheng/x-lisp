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
      if (instr.index > 6) {
        let message = `[onInstr] can not handle more then 6 argument yet`
        message += `\n  instr: ${formatInstr(instr)}`
        throw new Error(message)
      }

      const argRegName =
        M.ABIs["x86-64-sysv"]["argument-reg-names"][instr.index]
      return [M.Instr("movq", [M.Reg(argRegName), M.Var(instr.dest)])]
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

        case "FunctionRef": {
          return [
            M.Instr("leaq", [
              M.DerefLabel(instr.value.name),
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
        ...instr.args.entries().map(([index, arg]) => {
          const argRegName = M.ABIs["x86-64-sysv"]["argument-reg-names"][index]
          return M.Instr("movq", [M.Var(arg), M.Reg(argRegName)])
        }),
        M.Instr("callq-with-arity", [
          M.Label(instr.name),
          M.Arity(instr.args.length),
        ]),
        M.Instr("movq", [M.Reg("rax"), M.Var(instr.dest)]),
      ]
    }

    case "Apply": {
      // const rhs = `(apply ${instr.target} ${instr.arg})`
      // return `(= ${instr.dest} ${rhs})`

      // TODO
      return []
    }

    case "NullaryApply": {
      // const rhs = `(nullary-apply ${instr.target})`
      // return `(= ${instr.dest} ${rhs})`

      // TODO
      return []
    }
  }
}
