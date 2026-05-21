import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.

export function CheckPass(
  project: M.Project,
  options: {
    dump: boolean
  },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      M.definitionCheck(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "080-check")
}
