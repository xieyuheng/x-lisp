import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import * as B from "../../basic/index.ts"
import { textWidth } from "../../config.ts"
import * as Stk from "../../stack/index.ts"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function BuildPipeline(
  project: M.Project,
  options: {
    dump: boolean
    basic: boolean
    verbose: boolean
  },
): void {
  M.ExecutePass(project)
  M.ClaimPass(project)
  if (options.dump) projectDumpMods(project, "005-claim")
  M.DesugarPass(project)
  if (options.dump) projectDumpMods(project, "010-desugar")
  M.QualifyPass(project)
  if (options.dump) projectDumpMods(project, "020-qualify")
  M.LocatePass(project)
  if (options.dump) projectDumpMods(project, "030-locate")
  M.CheckPass(project, { verbose: options.verbose })
  if (options.dump) projectDumpMods(project, "040-check")
  M.ShrinkPass(project)
  if (options.dump) projectDumpMods(project, "050-shrink")
  M.UniquifyPass(project)
  if (options.dump) projectDumpMods(project, "060-uniquify")
  M.LiftLambdaPass(project)
  if (options.dump) projectDumpMods(project, "070-lift-lambda")
  M.UnnestOperandPass(project)
  if (options.dump) projectDumpMods(project, "080-unnest-operand")
  if (options.basic) projectBundleBasic(project)
  projectBundleStack(project)
}

function projectBundleStack(project: M.Project): void {
  const basicMod = B.createMod()
  M.projectForEachMod(project, (mod) => {
    if (!mod.isTypeErrorModule) {
      M.log("bundle.stack", mod.name)
      M.ExplicateControlPass(mod, basicMod)
    }
  })

  const stackMod = Stk.createMod()
  M.CodegenPass(basicMod, stackMod)

  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.stack`), (file) => {
    for (const definition of stackMod.definitions.values()) {
      fileWriteln(file, Stk.formatDefinition(definition))
    }
  })
}

function projectBundleBasic(project: M.Project): void {
  let code = ""
  M.projectForEachMod(project, (mod) => {
    if (!mod.isTypeErrorModule) {
      M.log("bundle.basic", mod.name)
      const basicMod = B.createMod()
      M.ExplicateControlPass(mod, basicMod)
      code += B.prettyMod(textWidth, basicMod)
      code += "\n\n"
    }
  })

  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) =>
    fileWriteln(file, code.trim()),
  )
}
