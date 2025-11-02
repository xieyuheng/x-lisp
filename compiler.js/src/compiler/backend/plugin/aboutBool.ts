import * as Values from "../value/index.ts"
import { definePureInstr, type Plugin } from "./index.ts"

export function aboutBool(plugin: Plugin) {
  definePureInstr(plugin, "not", 1, (x) => {
    return Values.Bool(!Values.asBool(x).content)
  })
}
