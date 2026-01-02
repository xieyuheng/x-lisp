import { systemShellRun } from "@xieyuheng/helpers.js/system"

export function assembleX86File(file: string): void {
  if (!file.endsWith(".s")) {
    let message = `[assembleX86File] expect file to end with .s`
    message += `\n  file: ${file}`
    throw new Error(message)
  }

  const objectFile = file.slice(0, -2) + ".o"
  const binaryFile = file.slice(0, -2) + ".exe"

  {
    const result = systemShellRun("as", ["-g", file, "-o", objectFile])
    if (result.stdout) console.log(result.stdout)
    if (result.stderr) console.error(result.stderr)
    if (result.status !== 0) process.exit(result.status)
  }

  {
    const result = systemShellRun("ld", [objectFile, "-o", binaryFile])
    if (result.stdout) console.log(result.stdout)
    if (result.stderr) console.error(result.stderr)
    if (result.status !== 0) process.exit(result.status)
  }
}
