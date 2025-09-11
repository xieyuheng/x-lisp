import { spawnSync } from "child_process"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutSystem(mod: Mod) {
  provide(mod, ["system-shell-run"])

  definePrimitiveFunction(mod, "system-shell-run", 1, (command) => {
    const result = spawnSync(Values.asString(command).content, { shell: true })
    const exitCode =
      result.status === null ? Values.Null() : Values.Int(result.status)
    const stdout = Values.String(result.stdout.toString())
    const stderr = Values.String(result.stderr.toString())
    return Values.Record({
      "exit-code": exitCode,
      stdout,
      stderr,
    })
  })
}
