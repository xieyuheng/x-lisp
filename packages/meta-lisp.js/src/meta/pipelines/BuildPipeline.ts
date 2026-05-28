import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as B from "../../basic/index.ts"
import { textWidth } from "../../config.ts"
import * as Xasm from "../../xasm/index.ts"
import * as M from "../index.ts"

// - no CheckPass during BuildPipeline.

export function BuildPipeline(
  pkg: M.Package,
  options: Map<string, string>,
): void {
  M.ExpandPass(pkg, options)
  M.ModuleInjectBuiltinPass(pkg)
  const modInfo = M.ModuleAnalysisPass(pkg)
  const algebraicInfo = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, modInfo, algebraicInfo, options)
  M.DesugarPass(pkg, options)
  M.ModuleImportPass(pkg, modInfo, options)
  M.ExecutePass(pkg, options)
  M.ClaimPass(pkg)
  M.QualifyPass(pkg, options)
  M.LocatePass(pkg, options)
  M.ShrinkPass(pkg, options)
  M.UniquifyPass(pkg, options)
  M.LiftLambdaPass(pkg, options)
  M.UnnestOperandPass(pkg, options)

  const basicMod = M.ExplicateControlPass(pkg)
  if (options.has("basic")) BasicBundle(pkg, basicMod)

  const xasmMod = M.CodegenPass(pkg, basicMod)
  XasmBundle(pkg, xasmMod)

  xvmAssemble(pkg)
}

function BasicBundle(pkg: M.Package, basicMod: B.Mod): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) => {
    const definitions = Array.from(basicMod.definitions.values())
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
      fileWriteln(file, `(default-entry ${pkg.config.entry})`)
    }
    const definitions = Array.from(xasmMod.definitions.values())
    const code = definitions.map(Xasm.formatDefinition).join("\n")
    fileWriteln(file, code)
  })
}

function xvmAssemble(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../../xvm.c/src/xvm.exe")
  const xasmPath = Path.join(M.packageOutputDirectory(pkg), "bundle.xasm")
  systemShellRun(xvmPath, ["assemble", xasmPath])
}
