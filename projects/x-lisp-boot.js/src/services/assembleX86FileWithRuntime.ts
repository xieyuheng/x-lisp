import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"

export function assembleX86FileWithRuntime(
  file: string,
  outputFile: string,
): void {
  if (!file.endsWith(".s")) {
    let message = `[assembleX86FileWithRuntime] expect file to end with .s`
    message += `\n  file: ${file}`
    throw new Error(message)
  }

  const inputFiles = [file, useRuntimeFile()]
  const ldflags = ["-lm", "-pthread", "-static", "-flto"]
  const cflags = ["-g", "-flto"]
  const args = [...cflags, ...inputFiles, ...ldflags, "-o", outputFile]
  const result = systemShellRun("gcc", args)
  if (result.stdout) console.log(result.stdout)
  if (result.stderr) console.error(result.stderr)
  if (result.status !== 0) process.exit(result.status)
}

function useRuntimeFile(): string {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const runtimeFile = Path.join(currentDir, "../../bin/x-lisp-runtime.o")
  return runtimeFile
}
