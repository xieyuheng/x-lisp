import { systemShellRun } from "../helpers/system/systemShellRun.ts"

export function assembleX86GasFile(file: string): void {
  if (!file.endsWith(".s")) {
    let message = `[assembleX86GasFile] expect file to end with .s`
    message += `\n  file: ${file}`
    throw new Error(message)
  }

  const objectFile = file.slice(0, -2) + ".o"
  const executableFile = file.slice(0, -2)

  {
    const result = systemShellRun("as", [file, "-o", objectFile])
    if (result.stdout) console.log(result.stdout)
    if (result.stderr) console.error(result.stderr)
    if (result.status !== 0) process.exit(result.status)
  }

  {
    const result = systemShellRun("ld", [objectFile, "-o", executableFile])
    if (result.stdout) console.log(result.stdout)
    if (result.stderr) console.error(result.stderr)
    if (result.status !== 0) process.exit(result.status)
  }
}
