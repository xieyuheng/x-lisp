import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyBlock } from "./prettyBlock.ts"
import { prettyData } from "./prettyData.ts"

export function prettyDefinition(definition: X86.Definition): Ppml.Node {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blockNodes = definition.blocks.map(prettyBlock)
      return Ppml.prettyVertical(
        "define-code",
        [Ppml.text(definition.name)],
        blockNodes,
      )
    }
    case "DataDefinition":
      return Ppml.prettySyntax(
        "define-data",
        [Ppml.text(definition.name)],
        [prettyData(definition.value)],
      )
    case "MetadataDefinition":
      return Ppml.prettySyntax(
        "define-metadata",
        [Ppml.text(definition.target)],
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
