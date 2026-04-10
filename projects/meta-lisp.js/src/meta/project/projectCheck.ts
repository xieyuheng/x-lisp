import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"

export function projectCheck(project: M.Project): void {
  for (const id of M.projectSourceIds(project)) {
    M.logPath("load", id)
    const path = M.projectGetSourcePath(project, id)
    M.loadCode(project, path)
  }

  M.projectForEachDefinition(project, M.definitionDesugar)
  M.projectForEachDefinition(project, M.definitionQualify)

  M.projectForEachMod(project, (mod) => {
    M.logPath("check", mod.name)
    if (mod.isTypeErrorModule) {
      const directory = M.projectSnapshotDirectory(project)
      callWithFile(
        openOutputFile(`${directory}/type-error-modules/${mod.name}.out`),
        (file) => {
          withOutputToFile(file, () => {
            M.modForEachOwnDefinition(mod, M.definitionCheck)
          })
        },
      )
    } else {
      M.modForEachOwnDefinition(mod, (definition) => {
        M.definitionCheck(definition)
      })
    }
  })
}
