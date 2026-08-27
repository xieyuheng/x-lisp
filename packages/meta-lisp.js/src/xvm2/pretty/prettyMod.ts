import * as Ppml from "@xieyuheng/ppml.js"
import * as X2 from "../index.ts"
import { prettyDefinition } from "./prettyDefinition.ts"

export function prettyMod(mod: X2.Mod): Ppml.Node {
  const children: Array<Ppml.Node> = []

  if (mod.entry !== undefined) {
    children.push(
      Ppml.prettySyntax("default-entry", [], [Ppml.text(mod.entry)]),
    )
  }

  for (const definition of mod.definitions.values()) {
    children.push(prettyDefinition(definition))
  }

  return joinBlankLines(children)
}

function joinBlankLines(nodes: Array<Ppml.Node>): Ppml.Node {
  if (nodes.length === 0) return Ppml.nil()
  if (nodes.length === 1) return nodes[0]
  return Ppml.concat(
    nodes[0],
    Ppml.hardBr(),
    Ppml.hardBr(),
    joinBlankLines(nodes.slice(1)),
  )
}
