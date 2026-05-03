import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function CheckPass(
  project: M.Project,
  options: {
    verbose: boolean
    dump: boolean
  },
): void {
  for (const mod of project.mods.values()) {
    if (mod.isTypeErrorModule) {
      const directory = M.projectSnapshotDirectory(mod.project)
      callWithFile(
        openOutputFile(`${directory}/type-error-modules/${mod.name}.out`),
        (file) => {
          withOutputToFile(file, () => {
            for (const definition of mod.definitions.values()) {
              checkDefinition(definition, options)
            }
          })
        },
      )
    } else {
      for (const definition of mod.definitions.values()) {
        checkDefinition(definition, options)
      }
    }
  }

  if (options.dump) projectDumpMods(project, "020-check")
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
