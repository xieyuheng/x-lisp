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
