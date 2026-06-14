import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

export function TestXvmPipeline(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const metaPath = Path.join(
    currentDir,
    "../../../../meta-runtime.c/src/meta.exe",
  )
  const xvmExePath = Path.join(M.packageOutputDirectory(pkg), "bundle.xvm.exe")
  systemShellRun(metaPath, [
    "test-xvm",
    xvmExePath,
    "--snapshot",
    M.packageSnapshotDirectory(pkg),
    pkg.config.compiler.profile ? "--profile" : "",
    pkg.config.compiler.builtin ? "--builtin" : "",
  ])
}

export function TestX86Pipeline(pkg: M.Package): void {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const metaPath = Path.join(
    currentDir,
    "../../../../meta-runtime.c/src/meta.exe",
  )
  const x86ExePath = Path.join(M.packageOutputDirectory(pkg), "bundle.x86.exe")
  systemShellRun(metaPath, [
    "test-x86",
    x86ExePath,
    "--snapshot",
    M.packageSnapshotDirectory(pkg),
    pkg.config.compiler.profile ? "--profile" : "",
  ])
}
