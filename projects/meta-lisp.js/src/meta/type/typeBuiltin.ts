import { zeroLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

const z = zeroLocation("/builtin")

export function typeBuiltin(mod: M.Mod) {
  M.definePrimitiveVariable(mod, "type-t", M.TypeValue(M.TypeType()), z)
  M.definePrimitiveVariable(mod, "int-t", M.TypeValue(M.AtomType("int")), z)
  M.definePrimitiveVariable(mod, "float-t", M.TypeValue(M.AtomType("float")), z)
  M.definePrimitiveVariable(
    mod,
    "string-t",
    M.TypeValue(M.AtomType("string")),
    z,
  )
  M.definePrimitiveVariable(
    mod,
    "symbol-t",
    M.TypeValue(M.AtomType("symbol")),
    z,
  )
  M.definePrimitiveVariable(
    mod,
    "keyword-t",
    M.TypeValue(M.AtomType("keyword")),
    z,
  )
  M.definePrimitiveVariable(mod, "bool-t", M.TypeValue(M.AtomType("bool")), z)
  M.definePrimitiveVariable(mod, "void-t", M.TypeValue(M.AtomType("void")), z)
  M.definePrimitiveVariable(mod, "file-t", M.TypeValue(M.AtomType("file")), z)
  M.definePrimitiveFunction(
    mod,
    "list-t",
    1,
    (E) => M.TypeValue(M.ListType(M.asTypeValue(E).type)),
    z,
  )
  M.definePrimitiveFunction(
    mod,
    "set-t",
    1,
    (E) => M.TypeValue(M.SetType(M.asTypeValue(E).type)),
    z,
  )
  M.definePrimitiveFunction(
    mod,
    "hash-t",
    2,
    (K, V) =>
      M.TypeValue(M.HashType(M.asTypeValue(K).type, M.asTypeValue(V).type)),
    z,
  )
}
