import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export const StackLispInterpreterPath = Path.join(
  currentDir,
  "../../../../stack-lisp.c/src/stack-lisp.exe",
)

export function projectTest(
  project: M.Project,
  options: {
    builtin: boolean
    verbose: boolean
  },
): void {
  M.projectBuild(project, {
    dump: false,
    basic: false,
    verbose: options.verbose,
  })

  systemShellRun(StackLispInterpreterPath, [
    "test",
    Path.join(M.projectOutputDirectory(project), "bundle.stack"),
    "--snapshot",
    M.projectSnapshotDirectory(project),
    options.builtin !== undefined ? "--builtin" : "",
  ])
}
