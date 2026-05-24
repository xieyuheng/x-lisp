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
  project: M.Project,
  options: Map<string, string>,
): void {
  M.ExpandPass(project, options)
  M.ModuleInjectBuiltinPass(project)
  const modInfo = M.ModuleAnalysisPass(project)
  const algebraicInfo = M.AlgebraicAnalysisPass(project)
  M.LowerMatchPass(project, modInfo, algebraicInfo, options)
  M.DesugarPass(project, options)
  M.ModuleImportPass(project, modInfo, options)
  M.ExecutePass(project, options)
  M.ClaimPass(project)
  M.QualifyPass(project, options)
  M.LocatePass(project, options)
  M.ShrinkPass(project, options)
  M.UniquifyPass(project, options)
  M.LiftLambdaPass(project, options)
  M.UnnestOperandPass(project, options)

  const basicMod = M.ExplicateControlPass(project)
  if (options.has("basic")) BasicBundle(project, basicMod)

  const xasmMod = M.CodegenPass(project, basicMod)
  XasmBundle(project, xasmMod)

  xvmAssemble(project)
}

function BasicBundle(project: M.Project, basicMod: B.Mod): void {
  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) => {
    const definitions = Array.from(basicMod.definitions.values())
    const code = definitions
      .map((definition) => B.prettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function XasmBundle(project: M.Project, xasmMod: Xasm.Mod): void {
  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.xasm`), (file) => {
    const definitions = Array.from(xasmMod.definitions.values())
    const code = definitions.map(Xasm.formatDefinition).join("\n")
    fileWriteln(file, code)
  })
}

function xvmAssemble(project: M.Project): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../../xvm.c/src/xvm.exe")
  const xasmPath = Path.join(M.projectOutputDirectory(project), "bundle.xasm")
  systemShellRun(xvmPath, ["assemble", xasmPath])
}
