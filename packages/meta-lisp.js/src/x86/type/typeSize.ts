import { type Type } from "./Type.ts"

export function typeSize(type: Type): number {
  switch (type.kind) {
    case "VarType": {
      let message = `[typeSize] cannot compute size of VarType: ${type.name}`
      throw new Error(message)
    }

    case "DataType": {
      return type.typeConstructor.size(type.argTypes)
    }
  }
}
