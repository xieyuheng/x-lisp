import * as M from "../index.ts"

// 内置原子类型（AtomType 的 name）到中文类型名的映射。
// 对应中英对照表中 int-t / 整数型 等成对注册的内置类型，
// 见 evaluate/primitive.ts 的 setupPrimitive。
const atomTypeZhNames: Record<string, string> = {
  int: "整数",
  float: "浮点",
  text: "文本",
  symbol: "符号",
  bool: "真假",
  void: "空值",
  file: "文件",
}

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
      return M.langKeyword("type-t", "类型型")
    }

    case "AtomType": {
      if (M.lang === "zh") {
        const zh = atomTypeZhNames[type.name]
        if (zh !== undefined) {
          return `${zh}-t`
        } else {
          return `${type.name}-t`
        }
      } else {
        return `${type.name}-t`
      }
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
      return `(${M.langKeyword("list-t", "列表型")} ${elementType})`
    }

    case "ArrayType": {
      const elementType = formatType(type.elementType)
      return `(${M.langKeyword("array-t", "数组型")} ${elementType})`
    }

    case "SetType": {
      const elementType = formatType(type.elementType)
      return `(${M.langKeyword("set-t", "集合型")} ${elementType})`
    }

    case "HashType": {
      const keyType = formatType(type.keyType)
      const valueType = formatType(type.valueType)
      return `(${M.langKeyword("hash-t", "散列型")} ${keyType} ${valueType})`
    }

    case "PairType": {
      const firstType = formatType(type.firstType)
      const secondType = formatType(type.secondType)
      return `(${M.langKeyword("pair-t", "序对型")} ${firstType} ${secondType})`
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

    case "AllType": {
      const varTypes = formatTypes(type.varTypes)
      const bodyType = formatType(type.bodyType)
      return `(${M.langKeyword("all", "泛型")} (${varTypes}) ${bodyType})`
    }
  }
}
