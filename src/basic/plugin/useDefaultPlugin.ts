import { aboutConsole } from "./aboutConsole.ts"
import { aboutControlFlow } from "./aboutControlFlow.ts"
import { aboutCore } from "./aboutCore.ts"
import { aboutInt } from "./aboutInt.ts"
import { createPlugin, type Plugin } from "./index.ts"

export function useDefaultPlugin(): Plugin {
  const plugin = createPlugin()

  aboutControlFlow(plugin)
  aboutCore(plugin)
  aboutConsole(plugin)
  aboutInt(plugin)

  return plugin
}
