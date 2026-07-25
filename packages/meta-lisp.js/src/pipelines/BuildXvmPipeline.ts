import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import { systemShellRun } from "@xieyuheng/std.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as B from "../basic/index.ts"
import * as Pkg from "../package/index.ts"
import * as Passes from "../passes/index.ts"
import * as Xvm from "../xvm/index.ts"

export function BuildXvmPipeline(rootPkg: Pkg.Package): void {
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

  const basicMod = Passes.ExplicateControlPass(rootPkg)
  BasicBundle(rootPkg, basicMod)

  const xvmMod = Passes.XvmCodegenPass(rootPkg, basicMod)
  XvmBundle(rootPkg, xvmMod)

  xvmAssemble(rootPkg)
}

function BasicBundle(pkg: Pkg.Package, basicMod: B.Mod): void {
  const directory = Pkg.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) => {
    const definitions = Array.from(basicMod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => B.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function XvmBundle(pkg: Pkg.Package, xvmMod: Xvm.Mod): void {
  const directory = Pkg.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xvm.asm`), (file) => {
    if (pkg.config.entry) {
      fileWriteln(file, `(default-entry ${pkg.id}/${pkg.config.entry})`)
    }
    const definitions = Array.from(xvmMod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => Xvm.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function xvmAssemble(pkg: Pkg.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../xvm.c/src/xvm.exe")
  const xvmAsmPath = Path.join(
    Pkg.packageOutputDirectory(pkg),
    "bundle.xvm.asm",
  )
  systemShellRun(xvmPath, ["assemble-xvm", xvmAsmPath])
}
