import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.

export function CheckPass(
  project: M.Project,
  options: {
    verbose: boolean
    dump: boolean
  },
): void {
  for (const mod of project.mods.values()) {
    if (mod.isErrorModule) {
      withOutputToErrorModuleSnapshot(project, mod.name, () => {
        for (const definition of mod.definitions.values()) {
          checkDefinition(definition, options)
        }
      })
    } else {
      for (const definition of mod.definitions.values()) {
        checkDefinition(definition, options)
      }
    }
  }

  if (options.dump) projectDumpMods(project, "020-check")
}

function withOutputToErrorModuleSnapshot<A>(
  project: M.Project,
  modName: string,
  callback: () => A,
): A {
  const directory = M.projectSnapshotDirectory(project)
  return callWithFile(
    openOutputFile(`${directory}/error-modules/${modName}.out`),
    (file) => withOutputToFile(file, callback),
  )
}

function checkDefinition(
  definition: M.Definition,
  options: {
    verbose: boolean
  },
): void {
  const name = `${definition.mod.name}/${definition.name}`
  const start = performance.now()
  if (options.verbose) M.log("check", `${name} -- start`)

  M.definitionCheck(definition)

  const end = performance.now()
  const passed = end - start
  if (options.verbose)
    M.log("check", `${name} -- end in ${passed.toFixed(3)}ms`)
}
