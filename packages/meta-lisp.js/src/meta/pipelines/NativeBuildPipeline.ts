import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as fs from "node:fs"
import * as X86 from "../../x86/index.ts"
import * as M from "../index.ts"
import { X86CodegenPass } from "../passes/181-X86CodegenPass.ts"

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

  for (const pkg of closure) M.SubmitPass(pkg)

  for (const pkg of closure) M.ClaimPass(pkg)

  for (const pkg of closure) M.QualifyPass(pkg)

  for (const pkg of closure) M.CheckPass(pkg)

  for (const pkg of closure) M.LocatePass(pkg)

  for (const pkg of closure) M.ShrinkPass(pkg)

  for (const pkg of closure) M.UniquifyPass(pkg)

  for (const pkg of closure) M.LiftLambdaPass(pkg)

  for (const pkg of closure) M.UnnestOperandPass(pkg)

  const basicMod = M.ExplicateControlPass(rootPkg)
  const x86Mod = X86CodegenPass(rootPkg, basicMod)
  X86Bundle(rootPkg, x86Mod)

  const exe = X86.assembleExe(x86Mod)
  const directory = M.packageOutputDirectory(rootPkg)
  const exePath = `${directory}/bundle.x86.exe`
  fs.writeFileSync(exePath, exe)
}

function X86Bundle(pkg: M.Package, x86Mod: X86.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.x86.asm`), (file) => {
    const definitions = Array.from(x86Mod.definitions.values())
    const code = definitions
      .map((d) => X86.formatPrettyDefinition(80, d))
      .join("\n")
    fileWriteln(file, code)
  })
}
