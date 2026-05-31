import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as B from "../../basic/index.ts"
import * as Xasm from "../../xasm/index.ts"
import * as M from "../index.ts"

export function BuildPipeline(
  rootPkg: M.Package,
  options: Map<string, string>,
): void {
  M.ExpandPass(rootPkg, options)
  M.ModulePreludePass(rootPkg)
  const analysisResult = M.ModuleAnalysisPass(rootPkg)
  const algebraicInfo = M.AlgebraicAnalysisPass(rootPkg)
  M.LowerMatchPass(rootPkg, analysisResult, algebraicInfo, options)
  M.DesugarPass(rootPkg, options)
  M.ModuleImportPass(rootPkg, analysisResult, options)
  M.ExecutePass(rootPkg, options)
  M.ClaimPass(rootPkg)
  M.QualifyPass(rootPkg, options)
  M.CheckPass(rootPkg, options)
  M.LocatePass(rootPkg, options)
  M.ShrinkPass(rootPkg, options)
  M.UniquifyPass(rootPkg, options)
  M.LiftLambdaPass(rootPkg, options)
  M.UnnestOperandPass(rootPkg, options)

  const basicMod = M.ExplicateControlPass(rootPkg)
  if (options.has("basic")) BasicBundle(rootPkg, basicMod)

  const xasmMod = M.CodegenPass(rootPkg, basicMod)
  XasmBundle(rootPkg, xasmMod)

  xvmAssemble(rootPkg)
}

function BasicBundle(pkg: M.Package, basicMod: B.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) => {
    const definitions = Array.from(basicMod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => B.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function XasmBundle(pkg: M.Package, xasmMod: Xasm.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.xasm`), (file) => {
    if (pkg.config.entry) {
      fileWriteln(file, `(default-entry ${pkg.id}/${pkg.config.entry})`)
    }
    const definitions = Array.from(xasmMod.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => Xasm.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function xvmAssemble(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../../xvm.c/src/xvm.exe")
  const xasmPath = Path.join(M.packageOutputDirectory(pkg), "bundle.xasm")
  systemShellRun(xvmPath, ["assemble", xasmPath])
}
