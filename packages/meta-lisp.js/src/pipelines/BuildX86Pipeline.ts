import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as B from "../basic2/index.ts"
import * as Pkg from "../package/index.ts"
import * as Passes from "../passes/index.ts"
import * as X86 from "../x86/index.ts"

export function BuildX86Pipeline(rootPkg: Pkg.Package): void {
  const closure = Pkg.packageClosureInTopologicalOrder(rootPkg)

  for (const pkg of closure) Passes.ExpandPass(pkg)
  for (const pkg of closure) Passes.ModulePreludePass(pkg)

  const moduleReports = new Map<string, Passes.ModuleAnalysisReport>()
  for (const pkg of closure)
    moduleReports.set(pkg.id, Passes.ModuleAnalysisPass(pkg))

  const algebraicReports = new Map<string, Passes.AlgebraicAnalysisReport>()
  for (const pkg of closure)
    algebraicReports.set(pkg.id, Passes.AlgebraicAnalysisPass(pkg))

  for (const pkg of closure)
    Passes.LowerMatchPass(
      pkg,
      moduleReports.get(pkg.id)!,
      algebraicReports.get(pkg.id)!,
    )

  for (const pkg of closure) Passes.DesugarPass(pkg)
  for (const pkg of closure)
    Passes.ModuleImportPass(pkg, moduleReports.get(pkg.id)!)
  for (const pkg of closure) Passes.SetupPass(pkg)
  for (const pkg of closure) Passes.ClaimPass(pkg)
  for (const pkg of closure) Passes.QualifyPass(pkg)
  for (const pkg of closure) Passes.LocatePass(pkg)
  for (const pkg of closure) Passes.UniquifyPass(pkg)
  for (const pkg of closure) Passes.CheckPass(pkg)
  for (const pkg of closure) Passes.ConvertClosurePass(pkg)
  for (const pkg of closure) Passes.LimitArityPass(pkg, 6)
  for (const pkg of closure) Passes.UnnestOperandPass(pkg)

  const basicMod = Passes.ExplicateControlPass2(rootPkg)
  BasicBundle(rootPkg, basicMod)

  const ssaReport = Passes.SsaAnalysisPass(rootPkg, basicMod)

  const x86Mod = Passes.SelectInstructionPass(rootPkg, basicMod, ssaReport)
  X86Bundle(rootPkg, x86Mod)
}

function BasicBundle(pkg: Pkg.Package, basicMod: B.Mod): void {
  const directory = Pkg.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.basic2`), (file) => {
    const definitions = Array.from(basicMod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => B.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function X86Bundle(pkg: Pkg.Package, x86Mod: X86.Mod): void {
  const directory = Pkg.packageOutputDirectory(pkg)
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
