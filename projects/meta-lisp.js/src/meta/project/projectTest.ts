import { systemShellCapture } from "@xieyuheng/helpers.js/system"
import fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export const LiInterpreterPath = Path.join(
  currentDir,
  "../../../../li.c/src/li.exe",
)

export function projectTest(project: M.Project): void {
  M.projectBuild(project, { dump: false })

  const bundlePath = Path.join(M.projectOutputDirectory(project), "bundle.li")

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

        const args = [
          "run-function",
          `${mod.name}/${definition.name}`,
          bundlePath,
        ]
        const result = systemShellCapture(LiInterpreterPath, args)
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
