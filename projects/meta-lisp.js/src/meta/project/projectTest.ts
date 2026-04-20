import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export const LiInterpreterPath = Path.join(
  currentDir,
  "../../../../li.c/src/li.exe",
)

export function projectTest(project: M.Project): void {
  M.projectBuild(project, { dump: false, basic: false })
  const bundlePath = Path.join(M.projectOutputDirectory(project), "bundle.li")
  systemShellRun(LiInterpreterPath, ["test", bundlePath])
}
