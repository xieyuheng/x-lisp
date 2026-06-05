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

export function BuildPipeline(rootPkg: M.Package): void {
  M.ExpandPass(rootPkg)
  M.ModulePreludePass(rootPkg)
  const analysisResult = M.ModuleAnalysisPass(rootPkg)
  const algebraicInfo = M.AlgebraicAnalysisPass(rootPkg)
  M.LowerMatchPass(rootPkg, analysisResult, algebraicInfo)
  M.DesugarPass(rootPkg)
  M.ModuleImportPass(rootPkg, analysisResult)
  M.ExecutePass(rootPkg)
  M.ClaimPass(rootPkg)
  M.QualifyPass(rootPkg)
  M.CheckPass(rootPkg)
  M.LocatePass(rootPkg)
  M.ShrinkPass(rootPkg)
  M.UniquifyPass(rootPkg)
  M.LiftLambdaPass(rootPkg)
  M.UnnestOperandPass(rootPkg)

  const basicMod = M.ExplicateControlPass(rootPkg)
  if (rootPkg.config.compiler.basic) BasicBundle(rootPkg, basicMod)

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
