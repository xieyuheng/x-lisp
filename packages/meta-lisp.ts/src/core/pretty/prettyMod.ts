import * as Ppml from "@xieyuheng/ppml.ts"
import { type Mod } from "../mod/Mod.ts"
import { prettyDefinition } from "./prettyDefinition.ts"

export function prettyModDefinitions(mod: Mod): Array<Ppml.Node> {
  const definitions = Array.from(mod.definitions.values())
  return definitions.flatMap(prettyDefinition)
}
