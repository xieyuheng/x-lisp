import { type Type } from "./Type.ts"

export function typeSubst(subst: Map<string, Type>, type: Type): Type {
  switch (type.kind) {
    case "AtomType": {
      return type
    }

    case "VarType": {
      return subst.get(type.name) ?? type
    }

    case "DataType": {
      return {
        kind: "DataType",
        typeConstructor: type.typeConstructor,
        argTypes: type.argTypes.map((t) => typeSubst(subst, t)),
      }
    }
  }
}
