import * as M from "../index.ts"
import {
  systemShellRun,
  systemShellCapture,
} from "@xieyuheng/helpers.js/system"
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

        const args = ["run", `${mod.name}/${definition.name}`, bundlePath]
        const result = systemShellCapture(BasicInterpreterPath, args)
        if (result.status === 0) {
          if (result.stdout) fs.writeFileSync(snapshotPath, result.stdout)
          if (result.stderr) console.log(snapshotPath, result.stderr)
        } else {
          if (result.stdout) console.log(snapshotPath, result.stdout)
          if (result.stderr) console.log(snapshotPath, result.stderr)
        }
      }
    })
  })
}
