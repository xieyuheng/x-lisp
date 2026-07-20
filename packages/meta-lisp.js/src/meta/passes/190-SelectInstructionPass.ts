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

export function selectDefinition(definition: B.Definition): Array<X86.Stmt> {
  switch (definition.kind) {
    case  "StructDefinition": {
      // TODO
      return []
    }

    case  "FunctionDefinition": {
      // TODO
      return []
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
