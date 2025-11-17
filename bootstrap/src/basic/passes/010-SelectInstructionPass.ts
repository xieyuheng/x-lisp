import * as M from "../../machine/index.ts"
import type { Block } from "../block/index.ts"
import type { Definition } from "../definition/index.ts"
import { formatInstr, formatValue } from "../format/index.ts"
import type { Instr } from "../instr/index.ts"
import { modOwnDefinitions, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function SelectInstructionPass(mod: Mod, machineMod: M.Mod): void {
  machineMod.exported = mod.exported

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
      return selectConst(instr.dest, instr.value)
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
      return [M.Instr("jmp", [M.Label(instr.label, { isExternal: false })])]
    }

    case "Branch": {
      return [
        M.Instr("movq", [
          M.LabelDeref(M.Label(`x-true`, { isExternal: true })),
          M.Reg("rax"),
        ]),
        M.Instr("cmpq", [M.Var(instr.condition), M.Reg("rax")]),
        M.Instr("branch-if", [
          M.Cc("e"),
          M.Label(instr.thenLabel, { isExternal: false }),
          M.Label(instr.elseLabel, { isExternal: false }),
        ]),
      ]
    }

    case "Call": {
      return selectCall(instr.dest, instr.fn, instr.args)
    }

    case "Apply": {
      const fn = Values.Function("apply-unary", 2, { isPrimitive: true })
      return selectCall(instr.dest, fn, [instr.target, instr.arg])
    }

    case "NullaryApply": {
      const fn = Values.Function("apply-nullary", 1, { isPrimitive: true })
      return selectCall(instr.dest, fn, [instr.target])
    }
  }
}

function selectArgReg(index: number): M.Reg {
  const argRegName = M.ABIs["x86-64-sysv"]["argument-reg-names"][index]
  return M.Reg(argRegName)
}

function selectCall(
  dest: string,
  fn: Values.Function,
  args: Array<string>,
): Array<M.Instr> {
  const prepareArguments = Array.from(args.entries()).map(([index, arg]) =>
    M.Instr("movq", [M.Var(arg), selectArgReg(index)]),
  )

  return [
    ...prepareArguments,
    M.Instr("callq-n", [selectFunctionLabel(fn), M.Arity(args.length)]),
    M.Instr("movq", [M.Reg("rax"), M.Var(dest)]),
  ]
}

function selectConst(dest: string, value: Value): Array<M.Instr> {
  if (Values.isBool(value)) {
    if (Values.isTrue(value)) {
      return [
        M.Instr("movq", [
          M.LabelDeref(M.Label(`x-true`, { isExternal: true })),
          M.Var(dest),
        ]),
      ]
    } else {
      return [
        M.Instr("movq", [
          M.LabelDeref(M.Label(`x-false`, { isExternal: true })),
          M.Var(dest),
        ]),
      ]
    }
  }

  switch (value.kind) {
    case "Int": {
      return [M.Instr("movq", [M.Imm(M.encodeInt(value.content)), M.Var(dest)])]
    }

    case "Function": {
      return selectConstFunction(dest, value)
    }

    default: {
      let message = `[selectConst] unhandled value`
      message += `\n  value: ${formatValue(value)}`
      message += `\n  dest: ${dest}`
      throw new Error(message)
    }
  }
}

function selectTagEncoding(operand: M.Operand, tag: M.Tag): Array<M.Instr> {
  return [
    M.Instr("salq", [M.Imm(3), operand]),
    M.Instr("orq", [M.Imm(tag), operand]),
  ]
}

function selectConstFunction(
  dest: string,
  fn: Values.Function,
): Array<M.Instr> {
  return [
    M.Instr("leaq", [M.LabelDeref(selectFunctionLabel(fn)), selectArgReg(0)]),
    ...selectTagEncoding(selectArgReg(0), M.AddressTag),
    M.Instr("movq", [M.Imm(M.encodeInt(fn.arity)), selectArgReg(1)]),
    M.Instr("movq", [M.Imm(M.encodeInt(0)), selectArgReg(2)]),
    M.Instr("callq-n", [
      M.Label("x-make-curry", { isExternal: true }),
      M.Arity(3),
    ]),
    M.Instr("movq", [M.Reg("rax"), M.Var(dest)]),
  ]
}

function selectFunctionLabel(fn: Values.Function): M.Label {
  return fn.attributes.isPrimitive
    ? M.Label(`x-${fn.name}`, { isExternal: true })
    : M.Label(fn.name, { isExternal: false })
}
