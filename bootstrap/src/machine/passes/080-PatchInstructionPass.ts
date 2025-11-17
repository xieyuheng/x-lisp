import * as M from "../../machine/index.ts"

export function PatchInstructionPass(mod: M.Mod): void {
  for (const definition of M.modDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = Array.from(definition.blocks.values())
      for (const block of blocks) {
        definition.blocks.set(block.label, onBlock(block))
      }

      return null
    }

    case "DataDefinition": {
      return null
    }
  }
}

function onBlock(block: M.Block): M.Block {
  return M.Block(block.label, block.instrs.flatMap(onInstr), block.meta)
}

function onInstr(instr: M.Instr): Array<M.Instr> {
  switch (instr.op) {
    case "movq": {
      // ;; remove self move instruction
      // (['movq [self self]] [])
    }

    case "movzbq": {
      // ;; the second operand of movzbq must be register
      // (['movzbq [operand-1 (the (negate reg-rand?) operand-2)]]
      //  [['movq [operand-2 (reg-rand 'rax)]]
      //   ['movzbq [operand-1 (reg-rand 'rax)]]])
    }

    case "cmpq": {
      // ;; the second operand of cmpq must not be an immediate
      // (['cmpq [operand-1 (imm-rand value)]]
      //  [['movq [(imm-rand value) (reg-rand 'rax)]]
      //   ['cmpq [operand-1 (reg-rand 'rax)]]])
    }

    default: {
      // ;; fix two memory location operands
      // ([op [(deref-rand reg-name-1 offset-1)
      //       (deref-rand reg-name-2 offset-2)]]
      //  [['movq [(deref-rand reg-name-1 offset-1) (reg-rand 'rax)]]
      //   [op [(reg-rand 'rax) (deref-rand reg-name-2 offset-2)]]])

      return [instr]
    }
  }
}
