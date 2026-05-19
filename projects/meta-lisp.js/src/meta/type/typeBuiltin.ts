import { zeroLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import {
  definePrimitiveFunction,
  definePrimitiveVariable,
} from "../mod/define.ts"
import { type Mod } from "../mod/index.ts"

const z = zeroLocation("/builtin")

export function typeBuiltin(mod: Mod) {
  definePrimitiveVariable(mod, "type-t", M.TypeValue(M.TypeType()), z)
  definePrimitiveVariable(mod, "int-t", M.TypeValue(M.AtomType("int")), z)
  definePrimitiveVariable(mod, "float-t", M.TypeValue(M.AtomType("float")), z)
  definePrimitiveVariable(mod, "string-t", M.TypeValue(M.AtomType("string")), z)
  definePrimitiveVariable(mod, "symbol-t", M.TypeValue(M.AtomType("symbol")), z)
  definePrimitiveVariable(
    mod,
    "keyword-t",
    M.TypeValue(M.AtomType("keyword")),
    z,
  )
  definePrimitiveVariable(mod, "bool-t", M.TypeValue(M.AtomType("bool")), z)
  definePrimitiveVariable(mod, "void-t", M.TypeValue(M.AtomType("void")), z)
  definePrimitiveVariable(mod, "file-t", M.TypeValue(M.AtomType("file")), z)
  definePrimitiveFunction(
    mod,
    "list-t",
    1,
    (E) => M.TypeValue(M.ListType((E as M.TypeValue).type)),
    z,
  )
  definePrimitiveFunction(
    mod,
    "set-t",
    1,
    (E) => M.TypeValue(M.SetType((E as M.TypeValue).type)),
    z,
  )
  definePrimitiveFunction(
    mod,
    "hash-t",
    2,
    (K, V) =>
      M.TypeValue(M.HashType((K as M.TypeValue).type, (V as M.TypeValue).type)),
    z,
  )
}
