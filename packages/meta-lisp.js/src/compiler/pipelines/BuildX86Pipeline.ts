import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as B from "../../basic/index.ts"
import * as M from "../../meta/index.ts"
import * as X86 from "../../x86/index.ts"
import * as Passes from "../passes/index.ts"

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
  for (const pkg of closure) M.UniquifyPass(pkg)
  for (const pkg of closure) M.CheckPass(pkg)
  for (const pkg of closure) M.ConvertClosurePass(pkg)
  for (const pkg of closure) M.LimitArityPass(pkg, 6)
  for (const pkg of closure) M.UnnestOperandPass(pkg)

  const basicMod = Passes.ExplicateControlPass(rootPkg)
  const basicMod2 = Passes.CopyPropagationPass(basicMod)
  BasicBundle(rootPkg, basicMod2)

  const ssaReport = Passes.SsaAnalysisPass(rootPkg, basicMod2)

  const x86Mod = Passes.SelectInstructionPass(rootPkg, basicMod2, ssaReport)

  const { mod: x86ModAssigned, homeMap } = Passes.AssignHomesPass(x86Mod)
  const x86ModPatched = Passes.PatchInstructionsPass(x86ModAssigned)
  const x86ModFinal = Passes.PrologEpilogPass(x86ModPatched, homeMap)

  X86Bundle(rootPkg, x86ModFinal)
}

function BasicBundle(pkg: M.Package, basicMod: B.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.x86.basic`), (file) => {
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
