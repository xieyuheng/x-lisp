import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export function TestPipeline(
  project: M.Project,
  options: {
    profile: boolean
    builtin: boolean
  },
): void {
  systemShellRun(Path.join(currentDir, "../../../../xvm.c/src/xvm.exe"), [
    "test",
    Path.join(M.projectOutputDirectory(project), "bundle.xasm"),
    "--snapshot",
    M.projectSnapshotDirectory(project),
    options.profile ? "--profile" : "",
    options.builtin ? "--builtin" : "",
  ])
}
