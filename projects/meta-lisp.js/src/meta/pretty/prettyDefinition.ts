import * as Ppml from "@xieyuheng/ppml.js"
import * as M from "../index.ts"
import { prettyApplication, prettySyntax, prettyText } from "./layout.ts"
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
      return prettySyntax(
        "declare-primitive-function",
        [],
        [prettyText(definition.name), prettyText(definition.arity.toString())],
      )
    }

    case "PrimitiveVariableDefinition":
    case "PrimitiveVariableDeclaration": {
      return prettySyntax(
        "declare-primitive-variable",
        [],
        [prettyText(definition.name)],
      )
    }

    case "FunctionDefinition": {
      const name = definition.name
      const paramNodes = definition.parameters.map(Ppml.text)
      const defNode = prettyApplication([Ppml.text(name), ...paramNodes])
      const body = prettyTermBody(definition.body)
      return prettySyntax("define", [defNode], body)
    }

    case "VariableDefinition": {
      const name = definition.name
      const body = prettyTermBody(definition.body)
      return prettySyntax("define", [prettyText(name)], body)
    }

    case "TestDefinition": {
      const name = definition.name
      const body = prettyTermBody(definition.body)
      return prettySyntax("define-test", [prettyText(name)], body)
    }

    case "TypeDefinition": {
      const name = definition.name
      const body = prettyTermBody(definition.body)
      return prettySyntax("define-type", [prettyText(name)], body)
    }

    case "AlgebraicTypeDefinition": {
      const ctorNodes = definition.dataConstructors.map(prettyDataConstructor)
      if (definition.typeConstructor.parameters.length === 0) {
        return prettySyntax(
          "define-enum",
          [prettyText(definition.name)],
          ctorNodes,
        )
      } else {
        const paramsNode = prettyApplication([
          Ppml.text(definition.name),
          ...definition.typeConstructor.parameters.map(Ppml.text),
        ])
        return prettySyntax("define-enum", [paramsNode], ctorNodes)
      }
    }

    case "OpaqueTypeDefinition": {
      const paramsNode =
        definition.typeConstructor.parameters.length > 0
          ? prettyApplication([
              Ppml.text(definition.name),
              ...definition.typeConstructor.parameters.map(Ppml.text),
            ])
          : prettyText(definition.name)
      const reprNode = prettyTerm(definition.representationType)
      const ifaceNodes = definition.interfaceEntries.map((entry) =>
        prettyApplication([Ppml.text(entry.name), prettyTerm(entry.type)]),
      )
      return prettySyntax(
        "define-opaque-type",
        [],
        [paramsNode, reprNode, ...ifaceNodes],
      )
    }
  }
}

function prettyDataConstructor(dataConstructor: M.DataConstructor): Ppml.Node {
  if (dataConstructor.fields.length === 0) {
    return prettyText(dataConstructor.name)
  } else {
    const fieldNodes = dataConstructor.fields.map((field) =>
      prettyApplication([Ppml.text(field.name), prettyTerm(field.type)]),
    )
    return prettyApplication([prettyText(dataConstructor.name), ...fieldNodes])
  }
}

function prettyDefinitionType(mod: M.Mod, name: string): Ppml.Node | undefined {
  const claimedEntry = M.modLookupClaimedEntry(mod, name)
  if (claimedEntry) {
    return prettySyntax(
      "claim",
      [prettyText(name)],
      [prettyTerm(claimedEntry.exp)],
    )
  }

  const inferredType = M.modLookupInferredType(mod, name)
  if (inferredType) {
    return prettySyntax("claim", [prettyText(name)], [prettyType(inferredType)])
  }

  return undefined
}

function prettyType(type: M.Type): Ppml.Node {
  switch (type.kind) {
    case "VarType": {
      if (type.serialNumber === 0n) {
        return prettyText(type.name)
      } else {
        return prettyText(M.varTypeId(type))
      }
    }

    case "CanonicalLabelType": {
      return prettyText(`_.${type.serialNumber}`)
    }

    case "TypeType": {
      return prettyText("type-t")
    }

    case "AtomType": {
      return prettyText(`${type.name}-t`)
    }

    case "ArrowType": {
      const uncurried = M.asArrowType(M.arrowTypeUncurrying(type))
      const argTypes = uncurried.argTypes.map(prettyType)
      const retType = prettyType(uncurried.retType)
      if (argTypes.length === 0) {
        return prettyApplication([prettyText("->"), retType])
      } else {
        return prettyApplication([prettyText("->"), ...argTypes, retType])
      }
    }

    case "ListType": {
      return prettyApplication([
        prettyText("list-t"),
        prettyType(type.elementType),
      ])
    }

    case "SetType": {
      return prettyApplication([
        prettyText("set-t"),
        prettyType(type.elementType),
      ])
    }

    case "HashType": {
      return prettyApplication([
        prettyText("hash-t"),
        prettyType(type.keyType),
        prettyType(type.valueType),
      ])
    }

    case "DataType": {
      const modName = type.typeConstructor.mod.name
      const name = type.typeConstructor.name
      const argTypes = type.argTypes.map(prettyType)
      if (argTypes.length === 0) {
        return prettyText(`${modName}/${name}`)
      } else {
        return prettyApplication([
          prettyText(`${modName}/${name}`),
          ...argTypes,
        ])
      }
    }

    case "PolymorphicType": {
      const varTypes = type.varTypes.map(prettyType)
      const bodyType = prettyType(type.bodyType)
      return prettySyntax(
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
