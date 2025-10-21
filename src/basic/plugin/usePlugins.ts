import { aboutConsole } from "./aboutConsole.ts"
import { aboutCore } from "./aboutCore.ts"
import { aboutInt } from "./aboutInt.ts"
import type { Plugins } from "./index.ts"

export function usePlugins(): Plugins {
  return {
    ...aboutCore,
    ...aboutConsole,
    ...aboutInt,
  }
}
