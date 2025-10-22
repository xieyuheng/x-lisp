import { aboutConsole } from "./aboutConsole.ts"
import { aboutCore } from "./aboutCore.ts"
import { aboutInt } from "./aboutInt.ts"
import { createPlugin, type Plugin } from "./index.ts"

export function useDefaultPlugin(): Plugin {
  const plugin = createPlugin()

  aboutCore(plugin)
  aboutConsole(plugin)
  aboutInt(plugin)

  return plugin
}
