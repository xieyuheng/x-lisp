import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyData } from "./prettyData.ts"
import { prettyInstr } from "./prettyInstr.ts"

export function prettyDefinition(definition: X86.Definition): Ppml.Node {
  switch (definition.kind) {
    case "CodeDefinition": {
      const instrNodes = definition.instrs.map(prettyInstr)
      return Ppml.prettyVertical(
        "define-code",
        [Ppml.text(definition.name)],
        instrNodes,
      )
    }
    case "DataDefinition":
      return Ppml.prettySyntax(
        "define-data",
        [Ppml.text(definition.name)],
        [prettyData(definition.value)],
      )
    case "StructDefinition": {
      const fieldNodes = Object.keys(definition.fields).map((name) =>
        Ppml.text(`(${name} ${X86.formatType(definition.fields[name])})`),
      )
      return Ppml.prettySyntax(
        "define-struct",
        [Ppml.text(definition.name)],
        fieldNodes,
      )
    }
    case "SpaceDefinition":
      return Ppml.prettySyntax(
        "define-space",
        [Ppml.text(definition.name)],
        [prettyData(definition.size)],
      )
    case "PrimitiveTypeDefinition":
      return Ppml.text(X86.formatDefinition(definition))
  }
}
