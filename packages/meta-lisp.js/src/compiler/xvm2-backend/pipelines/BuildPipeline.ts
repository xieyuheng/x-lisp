import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as fs from "node:fs"
import * as B from "../../../basic/index.ts"
import * as M from "../../../meta/index.ts"
import * as Tlv from "../../../tlv/index.ts"
import * as Xvm2 from "../../../xvm2/index.ts"
import * as Xvm2Backend from "../passes/index.ts"

export function BuildPipeline(rootPkg: M.Package): void {
  M.CorePipeline(rootPkg)

  const basicProgram = Xvm2Backend.ExplicateControlPass(rootPkg)
  B.CopyPropagationPass(basicProgram)
  BasicBundle(rootPkg, basicProgram)

  const program = Xvm2Backend.SelectInstructionPass(basicProgram)

  const entryName = rootPkg.config.entry
    ? `${rootPkg.id}/${rootPkg.config.entry}`
    : undefined
  Xvm2Backend.InjectMainAndTestPass(program, entryName)

  Xvm2Bundle(rootPkg, program)
  Xvm2Assemble(rootPkg, program)
}

function BasicBundle(pkg: M.Package, basicProgram: B.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xvm2.basic`), (file) => {
    const definitions = Array.from(basicProgram.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => B.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function Xvm2Bundle(pkg: M.Package, program: Xvm2.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xvm2.asm`), (file) => {
    const definitions = Array.from(program.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => Xvm2.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function Xvm2Assemble(pkg: M.Package, program: Xvm2.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  const exe = Xvm2.assembleProgram(program)
  const tlv = Xvm2.encodeExe(exe)
  const buf = Tlv.encodeTlv(tlv)
  fs.writeFileSync(`${directory}/bundle.xvm2.exe`, buf)
}
