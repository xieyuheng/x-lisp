import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

export function TestPipeline(
  project: M.Project,
  options: {
    profile: boolean
    builtin: boolean
  },
): void {
  xvmText(project, options)
}

function xvmText(
  project: M.Project,
  options: {
    profile: boolean
    builtin: boolean
  },
): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../../xvm.c/src/xvm.exe")
  const xexePath = Path.join(M.projectOutputDirectory(project), "bundle.xexe")
  systemShellRun(xvmPath, [
    "test",
    xexePath,
    "--snapshot",
    M.projectSnapshotDirectory(project),
    options.profile ? "--profile" : "",
    options.builtin ? "--builtin" : "",
  ])
}
