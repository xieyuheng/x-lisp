import { systemShellRun } from "@xieyuheng/helpers.js/system"
import fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

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

  M.projectForEachDefinition(project, (definition) => {
    if (definition.kind === "TestDefinition") {
      M.log("test", definition.name)
      const snapshotPath = Path.join(
        M.projectSnapshotDirectory(project),
        "modules",
        `${definition.name}.out`,
      )

      fs.mkdirSync(Path.dirname(snapshotPath), { recursive: true })

      systemShellRun(BasicInterpreterPath, [
        "run",
        definition.name,
        bundlePath,
        ">",
        snapshotPath,
      ])
    }
  })
}
