import {
  definePrimitiveFunction,
  definePrimitiveVariable,
} from "../define/index.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinType(mod: Mod) {
  definePrimitiveVariable(mod, "type-t", M.createTypeType())
  mod.claimed.set("type-t", {
    exp: M.Var("type-t"),
    type: M.createTypeType(),
  })

  definePrimitiveVariable(mod, "int-t", M.createAtomType("int"))
  definePrimitiveVariable(mod, "float-t", M.createAtomType("float"))
  definePrimitiveVariable(mod, "string-t", M.createAtomType("string"))
  definePrimitiveVariable(mod, "symbol-t", M.createAtomType("symbol"))
  definePrimitiveVariable(mod, "keyword-t", M.createAtomType("keyword"))
  definePrimitiveVariable(mod, "bool-t", M.createAtomType("bool"))
  definePrimitiveVariable(mod, "void-t", M.createAtomType("void"))
  definePrimitiveVariable(mod, "file-t", M.createAtomType("file"))

  definePrimitiveFunction(mod, "list-t", 1, (elementType) => {
    return M.createListType(elementType)
  })

  definePrimitiveFunction(mod, "set-t", 1, (elementType) => {
    return M.createSetType(elementType)
  })

  definePrimitiveFunction(mod, "hash-t", 2, (keyType, valueType) => {
    return M.createHashType(keyType, valueType)
  })
}
