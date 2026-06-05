import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

export function TestPipeline(rootPkg: M.Package): void {
  xvmText(rootPkg)
}

function xvmText(rootPkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../../xvm.c/src/xvm.exe")
  const xexePath = Path.join(M.packageOutputDirectory(rootPkg), "bundle.xexe")
  systemShellRun(xvmPath, [
    "test",
    xexePath,
    "--snapshot",
    M.packageSnapshotDirectory(rootPkg),
    rootPkg.config.compiler.profile ? "--profile" : "",
    rootPkg.config.compiler.builtin ? "--builtin" : "",
  ])
}
