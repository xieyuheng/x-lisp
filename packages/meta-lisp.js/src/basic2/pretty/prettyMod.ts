import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"
import { prettyDefinition } from "./prettyDefinition.ts"
import { prettyType } from "./prettyType.ts"

export function prettyMod(mod: B.Mod): Ppml.Node {
  const children: Array<Ppml.Node> = []

  for (const [name, type] of mod.claims) {
    children.push(
      Ppml.prettySyntax("claim", [], [Ppml.text(name), prettyType(type)]),
    )
  }

  for (const definition of mod.definitions.values()) {
    children.push(prettyDefinition(definition))
  }

  return Ppml.prettySyntax("", [], children)
}
