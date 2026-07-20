import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as B from "../../basic2/index.ts"
import * as M from "../index.ts"
import * as X86 from "../../x86/index.ts"

export function BuildX86Pipeline(rootPkg: M.Package): void {
  const closure = M.packageClosureInTopologicalOrder(rootPkg)

  for (const pkg of closure) M.ExpandPass(pkg)
  for (const pkg of closure) M.ModulePreludePass(pkg)

  const moduleReports = new Map<string, M.ModuleAnalysisReport>()
  for (const pkg of closure)
    moduleReports.set(pkg.id, M.ModuleAnalysisPass(pkg))

  const algebraicReports = new Map<string, M.AlgebraicAnalysisReport>()
  for (const pkg of closure)
    algebraicReports.set(pkg.id, M.AlgebraicAnalysisPass(pkg))

  for (const pkg of closure)
    M.LowerMatchPass(
      pkg,
      moduleReports.get(pkg.id)!,
      algebraicReports.get(pkg.id)!,
    )

  for (const pkg of closure) M.DesugarPass(pkg)
  for (const pkg of closure) M.ModuleImportPass(pkg, moduleReports.get(pkg.id)!)
  for (const pkg of closure) M.SetupPass(pkg)
  for (const pkg of closure) M.ClaimPass(pkg)
  for (const pkg of closure) M.QualifyPass(pkg)
  for (const pkg of closure) M.LocatePass(pkg)
  for (const pkg of closure) M.CheckPass(pkg)
  for (const pkg of closure) M.ShrinkPass(pkg)
  for (const pkg of closure) M.UniquifyPass(pkg)
  for (const pkg of closure) M.LiftLambdaPass(pkg)
  for (const pkg of closure) M.UnnestOperandPass(pkg)

  const basicMod = M.ExplicateControlPass2(rootPkg)
  BasicBundle(rootPkg, basicMod)

  const x86Mod = M.SelectInstructionPass(rootPkg, basicMod)
  X86Bundle(rootPkg, x86Mod)
}

function BasicBundle(pkg: M.Package, basicMod: B.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.basic2`), (file) => {
    const definitions = Array.from(basicMod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => B.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function X86Bundle(pkg: M.Package, x86Mod: X86.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.x86.asm`), (file) => {
    // if (pkg.config.entry) {
    //   fileWriteln(file, `(default-entry ${pkg.id}/${pkg.config.entry})`)
    // }
    const definitions = Array.from(x86Mod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => X86.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}
