import { spawnSync } from "node:child_process"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinSystem(mod: Mod) {
  provide(mod, ["system-shell-run"])

  definePrimitiveFunction(mod, "system-shell-run", 2, (command, args) => {
    const result = spawnSync(
      [
        Values.asStringValue(command).content,
        ...Values.asTaelValue(args).elements.map(
          (element) => Values.asStringValue(element).content,
        ),
      ].join(" "),
      { shell: true },
    )
    const exitCode =
      result.status === null
        ? Values.NullValue()
        : Values.IntValue(BigInt(result.status))
    const stdout = Values.StringValue(result.stdout.toString())
    const stderr = Values.StringValue(result.stderr.toString())
    return Values.RecordValue({
      "exit-code": exitCode,
      stdout,
      stderr,
    })
  })
}
