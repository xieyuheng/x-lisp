import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import { systemShellRun } from "@xieyuheng/std.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as B from "../../basic/index.ts"
import * as Compiler from "../../compiler/index.ts"
import * as M from "../../meta/index.ts"
import * as Xvm from "../../xvm/index.ts"

export function BuildXvmPipeline(rootPkg: M.Package): void {
  M.CorePipeline(rootPkg)

  const xvmResult = Compiler.XvmExplicateControlPass(rootPkg)
  B.CopyPropagationPass(xvmResult.program)
  BasicBundle(rootPkg, xvmResult.program)

  const xvmProgram = Compiler.XvmSelectInstructionPass(xvmResult)
  XvmBundle(rootPkg, xvmProgram)

  xvmAssemble(rootPkg)
}

function BasicBundle(pkg: M.Package, basicProgram: B.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xvm.basic`), (file) => {
    const definitions = Array.from(basicProgram.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => B.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function XvmBundle(pkg: M.Package, xvmProgram: Xvm.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xvm.asm`), (file) => {
    if (pkg.config.entry) {
      fileWriteln(file, `(default-entry ${pkg.id}/${pkg.config.entry})`)
    }
    const definitions = Array.from(xvmProgram.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => Xvm.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function xvmAssemble(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../../xvm.c/src/xvm.exe")
  const xvmAsmPath = Path.join(M.packageOutputDirectory(pkg), "bundle.xvm.asm")
  systemShellRun(xvmPath, ["assemble", xvmAsmPath])
}
