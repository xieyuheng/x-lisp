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

  M.projectForEachMod(project, (mod) => {
    M.modForEachClaimEntry(mod, (entry) => {
      entry.exp = M.desugar(mod, entry.exp)
      entry.exp = M.qualifyFreeVar(mod, new Set(), entry.exp)
    })
  })

  M.projectForEachDefinition(project, M.definitionDesugar)

  const builtinMod = M.loadBuiltinMod(project)

  M.projectForEachMod(project, (mod) => {
    if (mod !== builtinMod) {
      M.modForEachOwnDefinition(mod, M.definitionQualifyFreeVar)
    }
  })

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
      M.modForEachOwnDefinition(mod, M.definitionCheck)
    }
  })
}
