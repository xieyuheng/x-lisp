import { formatValue } from "../format/index.ts"
import { defineEffectInstr, type Plugin } from "./index.ts"

export function aboutConsole(plugin: Plugin) {
  defineEffectInstr(plugin, "print", 1, (value) => {
    console.log(formatValue(value))
  })
}
