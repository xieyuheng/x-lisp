import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import * as B from "../../basic/index.ts"
import { textWidth } from "../../config.ts"
import * as M from "../index.ts"

export function projectBuild(project: M.Project): void {
  M.projectCheck(project)

  M.projectForEachMod(project, M.ShrinkPass)
  M.projectForEachMod(project, M.UniquifyPass)
  M.projectForEachMod(project, M.LiftLambdaPass)
  M.projectForEachMod(project, M.UnnestOperandPass)

  projectBundle(project)
}

export function projectBundle(project: M.Project): void {
  const builtinMod = M.loadBuiltinMod(project)

  M.projectForEachMod(project, (mod) => {
    if (mod !== builtinMod) {
      M.modForEachOwnDefinition(mod, M.definitionQualifyName)
    }
  })

  let code = ""

  M.projectForEachMod(project, (mod) => {
    if (!mod.isTypeErrorModule) {
      M.log("bundle", mod.name)
      const basicMod = B.createMod(mod.name, new Map())
      M.ExplicateControlPass(mod, basicMod)
      code += B.prettyMod(textWidth, basicMod)
      code += "\n\n"
    }
  })

  code = code.trim()

  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) =>
    fileWriteln(file, code),
  )
}
