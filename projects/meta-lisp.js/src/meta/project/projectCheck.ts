import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"
import {
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectCheck(project: Project): void {
  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    M.loadMod(path, project)
  }

  M.projectForEachDefinition(project, M.definitionDesugar)

  M.projectForEachMod(project, (mod) => {
    if (mod.name.endsWith(".type-error.meta")) {
      callWithFile(openOutputFile(`${mod.name}.out`), (file) => {
        withOutputToFile(file, () => {
          M.modForEachOwnDefinition(mod, M.definitionCheck)
        })
      })
    } else {
      M.modForEachOwnDefinition(mod, M.definitionCheck)
    }
  })
}
