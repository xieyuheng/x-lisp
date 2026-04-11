import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"

export function projectCheck(project: M.Project): void {
  projectPerformClaim(project)
  projectPerformDesugar(project)
  projectPerformQualify(project)
  projectPerformCheck(project)
}

export function projectPerformClaim(project: M.Project): void {
  M.projectForEachMod(project, (mod) => {
    M.modForEachClaimEntry(mod, (entry) => {
      entry.exp = M.desugar(mod, entry.exp)
      entry.exp = M.qualifyFreeVar(mod, new Set(), entry.exp)
    })
  })
}

export function projectPerformDesugar(project: M.Project): void {
  M.projectForEachDefinition(project, M.definitionDesugar)
}

export function projectPerformQualify(project: M.Project): void {
  const builtinMod = M.loadBuiltinMod(project)

  M.projectForEachMod(project, (mod) => {
    if (mod !== builtinMod) {
      M.modForEachOwnDefinition(mod, M.definitionQualifyFreeVar)
    }
  })
}

export function projectPerformCheck(project: M.Project): void {
  M.projectForEachMod(project, (mod) => {
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
