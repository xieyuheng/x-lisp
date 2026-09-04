import { systemShellRun } from "@xieyuheng/std.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../../../meta/index.ts"

export function TestPipeline(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvm2Path = Path.join(currentDir, "../../../../../xvm2.c/src/xvm.exe")
  const xvm2ExePath = Path.join(M.packageOutputDirectory(pkg), "bundle.xvm2.exe")
  systemShellRun(xvm2Path, [
    "test",
    xvm2ExePath,
    "--profile",
    pkg.config.compiler.builtin ? "--builtin" : "",
  ])
}
