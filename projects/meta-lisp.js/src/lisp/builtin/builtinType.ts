import {
  definePrimitiveFunction,
  definePrimitiveVariable,
  provide,
} from "../define/index.ts"
import * as L from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinType(mod: Mod) {
  provide(mod, [
    "type-t",
    "bool-t",
    "int-t",
    "float-t",
    "string-t",
    "symbol-t",
    "keyword-t",
    "void-t",
    "list-t",
    "set-t",
    "hash-t",
  ])

  definePrimitiveVariable(mod, "type-t", L.createTypeType())
  mod.claimed.set("type-t", {
    exp: L.Var("type-t"),
    type: L.createTypeType(),
  })

  definePrimitiveVariable(mod, "bool-t", L.createAtomType("bool"))
  definePrimitiveVariable(mod, "int-t", L.createAtomType("int"))
  definePrimitiveVariable(mod, "float-t", L.createAtomType("float"))
  definePrimitiveVariable(mod, "string-t", L.createAtomType("string"))
  definePrimitiveVariable(mod, "symbol-t", L.createAtomType("symbol"))
  definePrimitiveVariable(mod, "keyword-t", L.createAtomType("keyword"))
  definePrimitiveVariable(mod, "void-t", L.createAtomType("void"))

  definePrimitiveFunction(mod, "list-t", 1, (elementType) => {
    return L.createListType(elementType)
  })

  definePrimitiveFunction(mod, "set-t", 1, (elementType) => {
    return L.createSetType(elementType)
  })

  definePrimitiveFunction(mod, "hash-t", 2, (keyType, valueType) => {
    return L.createHashType(keyType, valueType)
  })
}
