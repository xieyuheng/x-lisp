import { aboutConsole } from "./aboutConsole.ts"
import { aboutCore } from "./aboutCore.ts"
import type { Plugins } from "./index.ts"

export function usePlugins(): Plugins {
  return {
    ...aboutCore,
    ...aboutConsole,
  }
}
