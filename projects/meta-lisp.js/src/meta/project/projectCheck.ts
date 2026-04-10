import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"

export function projectCheck(project: M.Project): void {
  for (const id of M.projectSourceIds(project)) {
    const path = M.projectGetSourcePath(project, id)
    M.loadCode(project, path)
  }

  M.projectForEachDefinition(project, M.definitionDesugar)
  M.projectForEachMod(project, (mod) => {
    if (mod.isTypeErrorModule) {
      const directory = M.projectSnapshotDirectory(project)
      const outputPath = `${directory}/type-error-modules/${mod.name}.out`
      callWithFile(openOutputFile(outputPath), (file) => {
        withOutputToFile(file, () => {
          M.modForEachOwnDefinition(mod, M.definitionCheck)
        })
      })
    } else {
      M.modForEachOwnDefinition(mod, (definition) => {
        M.definitionCheck(definition)
      })
    }
  })
}
