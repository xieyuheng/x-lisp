import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as B from "../../basic/index.ts"
import * as Compiler from "../../compiler/index.ts"
import * as M from "../../meta/index.ts"
import * as Xvm2 from "../../xvm2/index.ts"

export function BuildXvm2Pipeline(
  rootPkg: M.Package,
  entryOverride?: string,
): void {
  M.CorePipeline(rootPkg)

  const basicProgram = Compiler.Xvm2ExplicateControlPass(rootPkg)
  B.CopyPropagationPass(basicProgram)
  BasicBundle(rootPkg, basicProgram)

  const program = Compiler.Xvm2SelectInstructionPass(basicProgram)

  const entryName =
    entryOverride ??
    (rootPkg.config.entry ? `${rootPkg.id}/${rootPkg.config.entry}` : undefined)
  Compiler.Xvm2InjectMainAndTestPass(program, entryName)

  Xvm2Bundle(rootPkg, program)
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
    if (program.entry !== undefined) {
      fileWriteln(file, `(default-entry ${program.entry})`)
    }
    const definitions = Array.from(program.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => Xvm2.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}
