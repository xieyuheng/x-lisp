import { aboutBool } from "./aboutBool.ts"
import { aboutConsole } from "./aboutConsole.ts"
import { aboutControlFlow } from "./aboutControlFlow.ts"
import { aboutFloat } from "./aboutFloat.ts"
import { aboutInt } from "./aboutInt.ts"
import { aboutTest } from "./aboutTest.ts"
import { aboutValue } from "./aboutValue.ts"
import { createPlugin, type Plugin } from "./index.ts"

export function useCorePlugin(): Plugin {
  const plugin = createPlugin()

  aboutControlFlow(plugin)
  aboutValue(plugin)
  aboutTest(plugin)
  aboutConsole(plugin)
  aboutBool(plugin)
  aboutInt(plugin)
  aboutFloat(plugin)

  return plugin
}
