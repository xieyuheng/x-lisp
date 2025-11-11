import { spawnSync } from "node:child_process"

type Result = {
  status: number | null
  stdout: string
  stderr: string
}

export function systemShellRun(name: string, args: Array<string>): Result {
  const result = spawnSync([name, args].join(" "), { shell: true })
  return {
    status: result.status,
    stdout: result.stdout.toString(),
    stderr: result.stderr.toString(),
  }
}
