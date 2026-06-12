import { type Type } from "./Type.ts"

export function typeSize(type: Type): number {
  switch (type.kind) {
    case "AtomType": {
      return atomTypeSize(type.name)
    }

    case "VarType": {
      let message = `[typeSize] cannot compute size of VarType: ${type.name}`
      throw new Error(message)
    }

    case "DataType": {
      return type.typeConstructor.size(type.argTypes)
    }
  }
}

function atomTypeSize(name: string): number {
  switch (name) {
    case "int8":
    case "uint8":
      return 1
    case "int16":
    case "uint16":
      return 2
    case "int32":
    case "uint32":
      return 4
    case "int64":
    case "uint64":
      return 8
    case "string":
      return 8
    default: {
      let message = `Unknown atom type: ${name}`
      throw new Error(message)
    }
  }
}
