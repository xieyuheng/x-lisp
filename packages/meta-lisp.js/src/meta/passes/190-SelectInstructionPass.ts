import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic2/index.ts"
import * as M from "../../meta/index.ts"
import * as X86 from "../../x86/index.ts"

// translate basic-lisp to assembly-lisp (with variables)

export function  SelectInstructionPass(pkg: M.Package, basicMod: B.Mod): X86.Mod {
  const x86Mod = X86.createMod()

  // TODO

  return x86Mod
}
