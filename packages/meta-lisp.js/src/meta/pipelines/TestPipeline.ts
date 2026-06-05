import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

export function TestPipeline(pkg: M.Package): void {
  xvmText(pkg)
}

function xvmText(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../../xvm.c/src/xvm.exe")
  const xexePath = Path.join(M.packageOutputDirectory(pkg), "bundle.xexe")
  systemShellRun(xvmPath, [
    "test",
    xexePath,
    "--snapshot",
    M.packageSnapshotDirectory(pkg),
    pkg.config.compiler.profile ? "--profile" : "",
    pkg.config.compiler.builtin ? "--builtin" : "",
  ])
}
