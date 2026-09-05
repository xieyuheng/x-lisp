import { systemShellRun } from "@xieyuheng/std.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../../../meta/index.ts"

export function TestPipeline(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const xvmPath = Path.join(currentDir, "../../../../../xvm.c/src/xvm.exe")
  const xvmExePath = Path.join(M.packageOutputDirectory(pkg), "bundle.xvm.exe")
  systemShellRun(xvmPath, ["test", xvmExePath])
}
