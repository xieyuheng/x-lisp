import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyBlock } from "./prettyBlock.ts"

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
    case "DataDefinition": {
      const fieldNodes = prettyFields(definition.fields, prettyValue)
      return Ppml.prettySyntax(
        "define-data",
        [Ppml.text(definition.name)],
        fieldNodes,
      )
    }
    case "MetadataDefinition": {
      const fieldNodes = prettyFields(definition.fields, prettyValue)
      return Ppml.prettySyntax(
        "define-metadata",
        [Ppml.text(definition.target)],
        fieldNodes,
      )
    }
    case "StructDefinition": {
      const fieldNodes = prettyTypeFields(definition.fields, prettyType)
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
        [Ppml.text(definition.size.toString())],
      )
  }
}

function prettyValue(value: X86.Value): Ppml.Node {
  switch (value.kind) {
    case "IntValue":
      return Ppml.text(value.value.toString())
    case "StringValue":
      return Ppml.text(JSON.stringify(value.content))
    case "LabelValue":
      return Ppml.prettySyntax(
        "label",
        [],
        [Ppml.text([value.name, ...value.path].join(" "))],
      )
    case "StructValue": {
      const fieldNodes = prettyFields(value.fields, prettyValue)
      const body = value.name
        ? [Ppml.text(value.name), ...fieldNodes]
        : fieldNodes
      return Ppml.prettySyntax("struct", [], body)
    }
    case "PointerValue":
      return Ppml.prettySyntax("pointer", [], [prettyValue(value.target)])
  }
}

function prettyType(type: X86.Type): Ppml.Node {
  switch (type.kind) {
    case "AtomType":
      return Ppml.text(type.name)
    case "PointerType":
      return Ppml.prettySyntax("pointer-t", [], [prettyType(type.target)])
    case "NamedType":
      return Ppml.text(type.name)
  }
}

export function prettyFields(
  fields: Map<string, X86.Value>,
  fmt: (value: X86.Value) => Ppml.Node,
): Array<Ppml.Node> {
  return Array.from(fields.entries()).map(([name, value]) =>
    Ppml.prettySyntax("", [], [Ppml.text(name), fmt(value)]),
  )
}

export function prettyTypeFields(
  fields: Map<string, X86.Type>,
  fmt: (type: X86.Type) => Ppml.Node,
): Array<Ppml.Node> {
  return Array.from(fields.entries()).map(([name, type]) =>
    Ppml.prettySyntax("", [], [Ppml.text(name), fmt(type)]),
  )
}
