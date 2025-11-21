import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import { type Mod } from "../mod/index.ts"

export function dependencyPrefix(
  dependencies: Map<string, Mod>,
  mod: Mod,
): string {
  const index = dependencyIndex(dependencies, mod)
  const subscript = stringToSubscript(index.toString())
  const prefix = `§${subscript}`
  return prefix
}

function dependencyIndex(dependencies: Map<string, Mod>, mod: Mod): number {
  const keys = Array.from(dependencies.keys())
  const index = keys.indexOf(mod.url.href)
  if (index === -1) {
    let message = `[dependencyIndex] internal error`
    message += `\n  keys: ${keys}`
    message += `\n  mod: ${mod.url}`
    throw new Error(message)
  }
  return index
}
