import { zeroLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import {
  definePrimitiveFunction,
  definePrimitiveVariable,
} from "../mod/define.ts"
import { type Mod } from "../mod/index.ts"

const z = zeroLocation("/builtin")

export function typeBuiltin(mod: Mod) {
  definePrimitiveVariable(mod, "type-t", M.TypeType(), z)
  definePrimitiveVariable(mod, "int-t", M.AtomType("int"), z)
  definePrimitiveVariable(mod, "float-t", M.AtomType("float"), z)
  definePrimitiveVariable(mod, "string-t", M.AtomType("string"), z)
  definePrimitiveVariable(mod, "symbol-t", M.AtomType("symbol"), z)
  definePrimitiveVariable(mod, "keyword-t", M.AtomType("keyword"), z)
  definePrimitiveVariable(mod, "bool-t", M.AtomType("bool"), z)
  definePrimitiveVariable(mod, "void-t", M.AtomType("void"), z)
  definePrimitiveVariable(mod, "file-t", M.AtomType("file"), z)
  definePrimitiveFunction(mod, "list-t", 1, (E) => M.ListType(E), z)
  definePrimitiveFunction(mod, "set-t", 1, (E) => M.SetType(E), z)
  definePrimitiveFunction(mod, "hash-t", 2, (K, V) => M.HashType(K, V), z)
}
