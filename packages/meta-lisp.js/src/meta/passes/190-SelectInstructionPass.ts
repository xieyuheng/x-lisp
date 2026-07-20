import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic2/index.ts"
import * as M from "../../meta/index.ts"
import * as X86 from "../../x86/index.ts"

// translate basic-lisp to assembly-lisp (with variables)

export function SelectInstructionPass(pkg: M.Package, basicMod: B.Mod): X86.Mod {
  const x86Mod = X86.createMod()
  const stmts = Array.from(basicMod.definitions.values())
    .flatMap(definition => selectDefinition(definition))
  X86.BuildPipeline(x86Mod, stmts)
  return x86Mod
}

function selectDefinition(definition: B.Definition): Array<X86.Stmt> {
  switch (definition.kind) {
    case  "StructDefinition": {
      // TODO
      return []
    }

    case  "FunctionDefinition": {
      const blocks = Array.from(definition.blocks.values()).map((block) => selectBlock(block))
      return [X86.DefineCodeStmt(definition.name, blocks)]
    }

    case  "VariableDefinition": {
      // TODO
      return []
    }

    case  "ExternFunctionDefinition": {
      // TODO
      return []
    }

    case  "ExternVariableDefinition": {
      // TODO
      return []
    }
  }
}

function selectBlock(basicBlock: B.Block): X86.Block {
  const instrs = basicBlock.instrs.flatMap(instr => selectInstr(instr))
  return X86.Block(basicBlock.label, instrs)
}

function selectInstr(instr: B.Instr): Array<X86.Instr> {
  return []
}
