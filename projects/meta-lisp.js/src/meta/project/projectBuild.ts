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

  let code = ""
  M.projectForEachMod(project, (mod) => {
    M.logPath("bundle", mod.name)
    const basicMod = B.createMod(mod.name, new Map())
    M.ExplicateControlPass(mod, basicMod)
    code += B.prettyMod(textWidth, basicMod)
    code += '\n\n'
  })

  code = code.trim()
  
  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) =>
    fileWriteln(file, code),
  )
}
