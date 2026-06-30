import * as Ppml from "@xieyuheng/ppml.js"
import * as M from "../index.ts"
import { prettyTerm, prettyTermBody } from "./prettyExp.ts"

export function prettyDefinition(definition: M.Definition): Array<Ppml.Node> {
  const defNode = nodeForDefinition(definition)
  const type = prettyDefinitionType(definition.mod, definition.name)
  if (type) {
    return [type, defNode]
  } else {
    return [defNode]
  }
}

function nodeForDefinition(definition: M.Definition): Ppml.Node {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveFunctionDeclaration": {
      return Ppml.prettySyntax(
        "declare-primitive-function",
        [],
        [Ppml.text(definition.name), Ppml.text(definition.arity.toString())],
      )
    }

    case "PrimitiveVariableDefinition":
    case "PrimitiveVariableDeclaration": {
      return Ppml.prettySyntax(
        "declare-primitive-variable",
        [],
        [Ppml.text(definition.name)],
      )
    }

    case "FunctionDefinition": {
      const name = definition.name
      const paramNodes = definition.parameters.map(Ppml.text)
      const defNode = Ppml.prettyApplication([Ppml.text(name), ...paramNodes])
      const body = prettyTermBody(definition.body)
      return Ppml.prettySyntax("define", [defNode], body)
    }

    case "VariableDefinition": {
      const name = definition.name
      const body = prettyTermBody(definition.body)
      return Ppml.prettySyntax("define", [Ppml.text(name)], body)
    }

    case "TestDefinition": {
      const name = definition.name
      const body = prettyTermBody(definition.body)
      return Ppml.prettySyntax("define-test", [Ppml.text(name)], body)
    }

    case "TypeDefinition": {
      const name = definition.name
      const body = prettyTermBody(definition.body)
      return Ppml.prettySyntax("define-type", [Ppml.text(name)], body)
    }

    case "AlgebraicTypeDefinition": {
      const ctorNodes = definition.dataConstructors.map(prettyDataConstructor)
      if (definition.typeConstructor.parameters.length === 0) {
        return Ppml.prettySyntax(
          "define-enum",
          [Ppml.text(definition.name)],
          ctorNodes,
        )
      } else {
        const paramsNode = Ppml.prettyApplication([
          Ppml.text(definition.name),
          ...definition.typeConstructor.parameters.map(Ppml.text),
        ])
        return Ppml.prettySyntax("define-enum", [paramsNode], ctorNodes)
      }
    }

    case "OpaqueTypeDefinition": {
      const paramsNode =
        definition.typeConstructor.parameters.length > 0
          ? Ppml.prettyApplication([
            Ppml.text(definition.name),
            ...definition.typeConstructor.parameters.map(Ppml.text),
          ])
          : Ppml.text(definition.name)
      const reprNode = prettyTerm(definition.representationType)
      const ifaceNodes = definition.interfaceEntries.map((entry) =>
        Ppml.prettyApplication([Ppml.text(entry.name), prettyTerm(entry.type)]),
      )
      return Ppml.prettySyntax(
        "define-opaque-type",
        [paramsNode, reprNode],
        ifaceNodes,
      )
    }
  }
}

function prettyDataConstructor(dataConstructor: M.DataConstructor): Ppml.Node {
  if (dataConstructor.fields.length === 0) {
    return Ppml.text(dataConstructor.name)
  } else {
    const fieldNodes = dataConstructor.fields.map((field) =>
      Ppml.prettyApplication([Ppml.text(field.name), prettyTerm(field.type)]),
    )
    return Ppml.prettyApplication([
      Ppml.text(dataConstructor.name),
      ...fieldNodes,
    ])
  }
}

function prettyDefinitionType(mod: M.Mod, name: string): Ppml.Node | undefined {
  const claimedEntry = M.modLookupClaimedEntry(mod, name)
  if (claimedEntry) {
    return Ppml.prettySyntax(
      "claim",
      [Ppml.text(name)],
      [prettyTerm(claimedEntry.term)],
    )
  }

  const inferredType = M.modLookupInferredType(mod, name)
  if (inferredType) {
    return Ppml.prettySyntax(
      "claim",
      [Ppml.text(name)],
      [prettyType(inferredType)],
    )
  }

  return undefined
}

function prettyType(type: M.Type): Ppml.Node {
  switch (type.kind) {
    case "VarType": {
      if (type.serialNumber === 0n) {
        return Ppml.text(type.name)
      } else {
        return Ppml.text(M.varTypeId(type))
      }
    }

    case "CanonicalLabelType": {
      return Ppml.text(`_.${type.serialNumber}`)
    }

    case "TypeType": {
      return Ppml.text("type-t")
    }

    case "AtomType": {
      return Ppml.text(`${type.name}-t`)
    }

    case "ArrowType": {
      const uncurried = M.asArrowType(M.arrowTypeUncurrying(type))
      const argTypes = uncurried.argTypes.map(prettyType)
      const retType = prettyType(uncurried.retType)
      if (argTypes.length === 0) {
        return Ppml.prettyApplication([Ppml.text("->"), retType])
      } else {
        return Ppml.prettyApplication([Ppml.text("->"), ...argTypes, retType])
      }
    }

    case "ListType": {
      return Ppml.prettyApplication([
        Ppml.text("list-t"),
        prettyType(type.elementType),
      ])
    }

    case "SetType": {
      return Ppml.prettyApplication([
        Ppml.text("set-t"),
        prettyType(type.elementType),
      ])
    }

    case "HashType": {
      return Ppml.prettyApplication([
        Ppml.text("hash-t"),
        prettyType(type.keyType),
        prettyType(type.valueType),
      ])
    }

    case "DataType": {
      const modName = type.typeConstructor.mod.name
      const name = type.typeConstructor.name
      const argTypes = type.argTypes.map(prettyType)
      if (argTypes.length === 0) {
        return Ppml.text(`${modName}/${name}`)
      } else {
        return Ppml.prettyApplication([
          Ppml.text(`${modName}/${name}`),
          ...argTypes,
        ])
      }
    }

    case "PolymorphicType": {
      const varTypes = type.varTypes.map(prettyType)
      const bodyType = prettyType(type.bodyType)
      return Ppml.prettySyntax(
        "polymorphic",
        [],
        [
          Ppml.group(Ppml.text("("), Ppml.flex(varTypes), Ppml.text(")")),
          bodyType,
        ],
      )
    }
  }
}
