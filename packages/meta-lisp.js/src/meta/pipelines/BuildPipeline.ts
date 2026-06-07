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

export function BuildPipeline(pkg: M.Package): void {
  M.ExpandPass(pkg)
  M.ModulePreludePass(pkg)
  const analysisReport = M.ModuleAnalysisPass(pkg)
  const algebraicReport = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, analysisReport, algebraicReport)
  M.DesugarPass(pkg)
  M.ModuleImportPass(pkg, analysisReport)
  M.ExecutePass(pkg)
  M.ClaimPass(pkg)
  M.QualifyPass(pkg)
  M.CheckPass(pkg)
  M.LocatePass(pkg)
  M.ShrinkPass(pkg)
  M.UniquifyPass(pkg)
  M.LiftLambdaPass(pkg)
  M.UnnestOperandPass(pkg)

  const basicMod = M.ExplicateControlPass(pkg)
  if (pkg.config.compiler.basic) BasicBundle(pkg, basicMod)

  const xasmMod = M.CodegenPass(pkg, basicMod)
  XasmBundle(pkg, xasmMod)

  xvmAssemble(pkg)
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
