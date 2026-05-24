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
  options: {
    dump: boolean
    basic: boolean
  },
): void {
  M.ExpandPass(project, { dump: options.dump })
  M.ModuleInjectBuiltinPass(project)
  const modInfo = M.ModuleAnalysisPass(project)
  const algebraicInfo = M.AlgebraicAnalysisPass(project)
  M.LowerMatchPass(project, modInfo, algebraicInfo, { dump: options.dump })
  M.DesugarPass(project, { dump: options.dump })
  M.ModuleImportPass(project, modInfo, { dump: options.dump })
  M.ExecutePass(project, { dump: options.dump })
  M.ClaimPass(project)
  M.QualifyPass(project, { dump: options.dump })
  M.LocatePass(project, { dump: options.dump })
  M.ShrinkPass(project, { dump: options.dump })
  M.UniquifyPass(project, { dump: options.dump })
  M.LiftLambdaPass(project, { dump: options.dump })
  M.UnnestOperandPass(project, { dump: options.dump })

  const basicMod = M.ExplicateControlPass(project)
  if (options.basic) BasicBundle(project, basicMod)

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
