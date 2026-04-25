import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
  writeln,
} from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function projectCheck(
  project: M.Project,
  options: {
    verbose: boolean
  },
): void {
  projectPerformClaim(project)
  projectPerformDesugar(project)
  projectPerformLocate(project)
  projectPerformQualify(project)
  projectPerformCheck(project, { verbose: options.verbose })
}

export function projectPerformClaim(project: M.Project): void {
  M.projectForEachMod(project, (mod) => {
    for (const [name, entry] of mod.claimed) {
      if (!mod.exempted.has(name) && mod.definitions.get(name) === undefined) {
        let message = `undefined claimed name`
        message += `\n  name: ${mod.name}/${name}`

        if (entry.exp.location) {
          writeln(S.sourceLocationReport(entry.exp.location, message))
        } else {
          message += `\n  exp: ${M.formatExp(entry.exp)}`
          writeln(message)
        }
      }
    }

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
  M.projectForEachDefinition(project, M.definitionQualifyFreeVar)
}

export function projectPerformLocate(project: M.Project): void {
  M.projectForEachDefinition(project, M.definitionLocateSpecialApply)
}

export function projectPerformCheck(
  project: M.Project,
  options: {
    verbose: boolean
  },
): void {
  M.projectForEachMod(project, (mod) => {
    if (mod.isTypeErrorModule) {
      const directory = M.projectSnapshotDirectory(project)
      callWithFile(
        openOutputFile(`${directory}/type-error-modules/${mod.name}.out`),
        (file) => {
          withOutputToFile(file, () => {
            M.modForEachOwnDefinition(mod, (definition) => {
              if (options.verbose)
                M.log("check", `${mod.name}/${definition.name}`)
              M.definitionCheck(definition)
            })
          })
        },
      )
    } else {
      M.modForEachOwnDefinition(mod, (definition) => {
        if (options.verbose) M.log("check", `${mod.name}/${definition.name}`)
        M.definitionCheck(definition)
      })
    }
  })
}
