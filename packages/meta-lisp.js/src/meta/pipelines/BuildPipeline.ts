import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as B from "../../basic/index.ts"
import * as Xvm from "../../xvm/index.ts"
import * as M from "../index.ts"

export function BuildPipeline(pkg: M.Package): void {
  M.ExpandPass(pkg)
  M.ModulePreludePass(pkg)
  const moduleAnalysisReport = M.ModuleAnalysisPass(pkg)
  const algebraicAnalysisReport = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, moduleAnalysisReport, algebraicAnalysisReport)
  M.DesugarPass(pkg)
  M.ModuleImportPass(pkg, moduleAnalysisReport)
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

  const xvmMod = M.CodegenPass(pkg, basicMod)
  XvmBundle(pkg, xvmMod)

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

function XvmBundle(pkg: M.Package, xvmMod: Xvm.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
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

function xvmAssemble(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const metaPath = Path.join(
    currentDir,
    "../../../../meta-runtime.c/src/meta.exe",
  )
  const xvmAsmPath = Path.join(M.packageOutputDirectory(pkg), "bundle.xvm.asm")
  systemShellRun(metaPath, ["assemble-xvm", xvmAsmPath])
}
