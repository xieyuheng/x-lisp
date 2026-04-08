import * as B from "../../basic/index.ts"
import { textWidth } from "../../config.ts"
import * as M from "../index.ts"

export function projectBuild(project: M.Project): void {
  for (const id of M.projectSourceIds(project)) {
    const path = M.projectGetSourcePath(project, id)
    M.loadCode(project, path)
  }

  M.projectForEachDefinition(project, M.definitionDesugar)
  M.projectForEachDefinition(project, M.definitionCheck)

  M.projectForEachMod(project, M.ShrinkPass)
  M.projectForEachMod(project, M.UniquifyPass)
  M.projectForEachMod(project, M.LiftLambdaPass)
  M.projectForEachMod(project, M.UnnestOperandPass)

  M.projectForEachMod(project, (mod) => {
    const basicMod = B.createMod(mod.name, new Map())
    M.ExplicateControlPass(mod, basicMod)
    const code = B.prettyMod(textWidth, basicMod)
    M.logPath("build", mod.name)
    console.log(code)
  })
}
