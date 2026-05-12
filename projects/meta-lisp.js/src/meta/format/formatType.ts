import * as M from "../index.ts"

export function formatTypes(types: Array<M.Type>): string {
  return types.map((t) => formatType(t)).join(" ")
}

export function formatType(type: M.Type): string {
  switch (type.kind) {
    case "VarType": {
      if (type.serialNumber === 0n) {
        return type.name
      } else {
        return M.varTypeId(type)
      }
    }

    case "CanonicalLabelType": {
      return `_.${type.serialNumber}`
    }

    case "TypeType": {
      return `type-t`
    }

    case "AtomType": {
      return `${type.name}-t`
    }

    case "ArrowType": {
      const uncurried = M.arrowTypeUncurrying(type) as M.ArrowType
      const argTypes = formatTypes(uncurried.argTypes)
      const retType = formatType(uncurried.retType)
      if (argTypes.length === 0) {
        return `(-> ${retType})`
      } else {
        return `(-> ${argTypes} ${retType})`
      }
    }

    case "ListType": {
      const elementType = formatType(type.elementType)
      return `(list-t ${elementType})`
    }

    case "SetType": {
      const elementType = formatType(type.elementType)
      return `(set-t ${elementType})`
    }

    case "HashType": {
      const keyType = formatType(type.keyType)
      const valueType = formatType(type.valueType)
      return `(hash-t ${keyType} ${valueType})`
    }

    case "AlgebraicDataType": {
      const definition = type.definition
      const argTypes = formatTypes(type.argTypes)
      if (argTypes.length === 0) {
        return `${definition.mod.name}/${definition.name}`
      } else {
        return `(${definition.mod.name}/${definition.name} ${argTypes})`
      }
    }

    case "PolymorphicType": {
      const varTypes = formatTypes(type.varTypes)
      const bodyType = formatType(type.bodyType)
      return `(polymorphic (${varTypes}) ${bodyType})`
    }

    case "CurryType":
    case "DefinitionType": {
      return `{${type.kind}}`
    }
  }
}
