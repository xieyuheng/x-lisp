import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as fs from "node:fs"
import * as B from "@xieyuheng/basic-lisp.js"
import * as M from "../../../meta/index.ts"
import * as Xvm from "@xieyuheng/xvm-lisp.js"
import * as XvmBackend from "../passes/index.ts"

export function BuildPipeline(rootPkg: M.Package): void {
  const basicProgram = XvmBackend.ExplicateControlPass(rootPkg)
  B.CopyPropagationPass(basicProgram)
  BasicBundle(rootPkg, basicProgram)

  const program = XvmBackend.SelectInstructionPass(basicProgram)

  const entryName = rootPkg.config.entry
    ? `${rootPkg.id}/${rootPkg.config.entry}`
    : undefined
  XvmBackend.InjectMainAndTestPass(program, entryName)

  XvmBundle(rootPkg, program)
  XvmAssemble(rootPkg, program)
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

function XvmBundle(pkg: M.Package, program: Xvm.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xvm.asm`), (file) => {
    const definitions = Array.from(program.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => Xvm.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function XvmAssemble(pkg: M.Package, program: Xvm.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  const exe = Xvm.assembleProgram(program)
  const tlv = Xvm.encodeExe(exe)
  const buf = Xvm.encodeTlv(tlv)
  fs.writeFileSync(`${directory}/bundle.xvm.exe`, buf)
}
