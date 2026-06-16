import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as fs from "node:fs"
import * as X86 from "../../x86/index.ts"
import * as M from "../index.ts"
import { X86CodegenPass } from "../passes/181-X86CodegenPass.ts"

export function BuildX86Pipeline(pkg: M.Package): void {
  M.ExpandPass(pkg)
  M.ModulePreludePass(pkg)
  const moduleAnalysisReport = M.ModuleAnalysisPass(pkg)
  const algebraicAnalysisReport = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, moduleAnalysisReport, algebraicAnalysisReport)
  M.DesugarPass(pkg)
  M.ModuleImportPass(pkg, moduleAnalysisReport)
  M.SubmitPass(pkg)
  M.ClaimPass(pkg)
  M.QualifyPass(pkg)
  M.CheckPass(pkg)
  M.LocatePass(pkg)
  M.ShrinkPass(pkg)
  M.UniquifyPass(pkg)
  M.LiftLambdaPass(pkg)
  M.UnnestOperandPass(pkg)

  const basicMod = M.ExplicateControlPass(pkg)
  const x86Mod = X86CodegenPass(pkg, basicMod)
  X86Bundle(pkg, x86Mod)

  const exe = X86.assembleExe(x86Mod)
  const directory = M.packageOutputDirectory(pkg)
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
