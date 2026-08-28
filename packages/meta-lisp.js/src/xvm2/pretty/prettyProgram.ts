import * as Ppml from "@xieyuheng/ppml.js"
import * as Xvm2 from "../index.ts"
import { prettyDefinition } from "./prettyDefinition.ts"

export function prettyProgram(program: Xvm2.Program): Ppml.Node {
  const children: Array<Ppml.Node> = []

  if (program.entry !== undefined) {
    children.push(
      Ppml.prettySyntax("default-entry", [], [Ppml.text(program.entry)]),
    )
  }

  for (const definition of program.definitions.values()) {
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
