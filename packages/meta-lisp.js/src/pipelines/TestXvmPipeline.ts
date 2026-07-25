import { systemShellRun } from "@xieyuheng/std.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as Pkg from "../package/index.ts"

export function TestXvmPipeline(pkg: Pkg.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../xvm.c/src/xvm.exe")
  const xvmExePath = Path.join(
    Pkg.packageOutputDirectory(pkg),
    "bundle.xvm.exe",
  )
  systemShellRun(xvmPath, [
    "test-xvm",
    xvmExePath,
    "--snapshot",
    Pkg.packageSnapshotDirectory(pkg),
    pkg.config.compiler.profile ? "--profile" : "",
    pkg.config.compiler.builtin ? "--builtin" : "",
  ])
}
