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
      mod.definitions = new Map(
        mod.definitions.entries().map(([name, definition]) => {
          const qualifiedName = `${mod.name}/${name}`
          definition.name = qualifiedName
          return [qualifiedName, definition]
        }),
      )

      mod.claimed = new Map(
        mod.claimed.entries().map(([name, entry]) => {
          const qualifiedName = `${mod.name}/${name}`
          entry.exp = M.qualifyFreeVar(mod, new Set(), entry.exp)
          return [qualifiedName, entry]
        }),
      )

      mod.exempted = new Set(
        Array.from(mod.exempted).map((name) => `${mod.name}/${name}`),
      )

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
