import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as B from "../../basic/index.ts"
import * as Compiler from "../../compiler/index.ts"
import * as M from "../../meta/index.ts"
import * as X2 from "../../xvm2/index.ts"

export function BuildXvm2Pipeline(
  rootPkg: M.Package,
  entryOverride?: string,
): void {
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
  for (const pkg of closure) M.UniquifyPass(pkg)
  for (const pkg of closure) M.ConvertClosurePass(pkg)
  for (const pkg of closure) M.LimitArityPass(pkg, 6)
  for (const pkg of closure) M.UnnestOperandPass(pkg)

  const basicMod = Compiler.Xvm2ExplicateControlPass(rootPkg)
  B.CopyPropagationPass(basicMod)
  BasicBundle(rootPkg, basicMod)

  const mod = Compiler.Xvm2SelectInstructionPass(basicMod)

  const entryName =
    entryOverride ??
    (rootPkg.config.entry ? `${rootPkg.id}/${rootPkg.config.entry}` : undefined)
  Compiler.Xvm2InjectMainAndTestPass(mod, entryName)

  X2Bundle(rootPkg, mod)
}

function BasicBundle(pkg: M.Package, basicMod: B.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xvm2.basic`), (file) => {
    const definitions = Array.from(basicMod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => B.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function X2Bundle(pkg: M.Package, mod: X2.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xvm2.asm`), (file) => {
    if (mod.entry !== undefined) {
      fileWriteln(file, `(default-entry ${mod.entry})`)
    }
    const definitions = Array.from(mod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => X2.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}
