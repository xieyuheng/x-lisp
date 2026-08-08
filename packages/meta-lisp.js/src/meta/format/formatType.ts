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
      const uncurried = M.asArrowType(M.arrowTypeUncurrying(type))
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

    case "PairType": {
      const firstType = formatType(type.firstType)
      const secondType = formatType(type.secondType)
      return `(pair-t ${firstType} ${secondType})`
    }

    case "DataType": {
      const modName = type.typeConstructor.mod.name
      const name = type.typeConstructor.name
      const argTypes = formatTypes(type.argTypes)
      if (argTypes.length === 0) {
        return `${modName}/${name}`
      } else {
        return `(${modName}/${name} ${argTypes})`
      }
    }

    case "PolymorphicType": {
      const varTypes = formatTypes(type.varTypes)
      const bodyType = formatType(type.bodyType)
      return `(all (${varTypes}) ${bodyType})`
    }
  }
}
