import * as Ppml from "@xieyuheng/ppml.js"
import * as N from "../index.ts"
import { prettyBlock } from "./prettyBlock.ts"

export function prettyDefinition(definition: N.Definition): Ppml.Node {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blockNodes = definition.blocks.map(prettyBlock)
      return Ppml.prettySyntax(
        "define-code",
        [Ppml.text(definition.name)],
        blockNodes,
      )
    }
    case "DataDefinition": {
      const fieldNodes = Array.from(definition.fields.entries()).map(
        ([name, value]) =>
          Ppml.prettySyntax("", [], [Ppml.text(name), prettyValue(value)]),
      )
      return Ppml.prettySyntax(
        "define-data",
        [Ppml.text(definition.name)],
        fieldNodes,
      )
    }
    case "MetadataDefinition": {
      const fieldNodes = Array.from(definition.fields.entries()).map(
        ([name, value]) =>
          Ppml.prettySyntax("", [], [Ppml.text(name), prettyValue(value)]),
      )
      return Ppml.prettySyntax(
        "define-metadata",
        [Ppml.text(definition.target)],
        fieldNodes,
      )
    }
    case "StructDefinition": {
      const fieldNodes = Array.from(definition.fields.entries()).map(
        ([name, type]) =>
          Ppml.prettySyntax("", [], [Ppml.text(name), prettyType(type)]),
      )
      return Ppml.prettySyntax(
        "define-struct",
        [Ppml.text(definition.name)],
        fieldNodes,
      )
    }
    case "SpaceDefinition":
      return Ppml.prettySyntax("define-space", [Ppml.text(definition.name)], [
        Ppml.text(definition.size.toString()),
      ])
  }
}

function prettyValue(value: N.Value): Ppml.Node {
  switch (value.kind) {
    case "IntValue":
      return Ppml.text(value.value.toString())
    case "StringValue":
      return Ppml.text(JSON.stringify(value.content))
    case "LabelValue":
      return Ppml.prettySyntax("label", [], [
        Ppml.text([value.name, ...value.path].join(" ")),
      ])
    case "StructValue": {
      const fieldNodes = Array.from(value.fields.entries()).map(
        ([name, v]) =>
          Ppml.prettySyntax("", [], [Ppml.text(name), prettyValue(v)]),
      )
      const body = value.name
        ? [Ppml.text(value.name), ...fieldNodes]
        : fieldNodes
      return Ppml.prettySyntax("struct", [], body)
    }
    case "PointerValue":
      return Ppml.prettySyntax("pointer", [], [prettyValue(value.target)])
  }
}

function prettyType(type: N.Type): Ppml.Node {
  switch (type.kind) {
    case "AtomType":
      return Ppml.text(type.name)
    case "PointerType":
      return Ppml.prettySyntax("pointer-t", [], [prettyType(type.target)])
    case "NamedType":
      return Ppml.text(type.name)
  }
}
