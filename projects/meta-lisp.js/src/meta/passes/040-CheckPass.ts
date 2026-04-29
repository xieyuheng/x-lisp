import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"

export function CheckPass(
  mod: M.Mod,
  options: {
    verbose: boolean
  },
): void {
  if (mod.isTypeErrorModule) {
    const directory = M.projectSnapshotDirectory(mod.project)
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
}
