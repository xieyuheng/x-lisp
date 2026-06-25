import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyBlock } from "./prettyBlock.ts"
import { prettyExp } from "./prettyExp.ts"

export function prettyDefinition(definition: X86.Definition): Ppml.Node {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blockNodes = definition.blocks.map(prettyBlock)
      return Ppml.prettySyntax(
        "define-code",
        [Ppml.text(definition.name)],
        blockNodes,
      )
    }
    case "DataDefinition":
      return Ppml.prettySyntax(
        "define-data",
        [Ppml.text(definition.name)],
        [prettyExp(definition.value)],
      )
    case "MetadataDefinition":
      return Ppml.prettySyntax(
        "define-metadata",
        [Ppml.text(definition.target)],
        [prettyExp(definition.value)],
      )
    case "StructDefinition": {
      const fieldNodes = definition.fields.map((f) =>
        Ppml.prettySyntax("", [], [Ppml.text(f.name), prettyExp(f.exp)]),
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
        [prettyExp(definition.size)],
      )
    case "PrimitiveTypeDefinition":
      return Ppml.prettySyntax(
        "declare-primitive-type",
        [Ppml.text(definition.name)],
        [],
      )
  }
}
