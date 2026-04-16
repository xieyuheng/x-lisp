import * as M from "../index.ts"
import { systemShellRun } from "@xieyuheng/helpers.js/system"
import fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export const BasicInterpreterPath = Path.join(
  currentDir,
  "../../../../basic-lisp.c/src/basic-lisp",
)

export function projectTest(project: M.Project): void {
  M.projectBuild(project, { dump: false })

  const bundlePath = Path.join(
    M.projectOutputDirectory(project),
    "bundle.basic",
  )

  M.projectForEachMod(project, (mod) => {
    if (mod.isTypeErrorModule) return

    M.modForEachOwnDefinition(mod, (definition) => {
      if (definition.kind === "TestDefinition") {
        M.log("test", `${mod.name}/${definition.name}`)

        const snapshotPath = Path.join(
          M.projectSnapshotDirectory(project),
          "modules",
          mod.name,
          `${definition.name}.out`,
        )

        fs.mkdirSync(Path.dirname(snapshotPath), { recursive: true })

        const builtinMod = M.loadBuiltinMod(mod.project)
        if (mod === builtinMod) {
          systemShellRun(BasicInterpreterPath, [
            "run",
            definition.name,
            bundlePath,
            ">",
            snapshotPath,
          ])
        } else {
          systemShellRun(BasicInterpreterPath, [
            "run",
            `${mod.name}/${definition.name}`,
            bundlePath,
            ">",
            snapshotPath,
          ])
        }
      }
    })
  })
}
