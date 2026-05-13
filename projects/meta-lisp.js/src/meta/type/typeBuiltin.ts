import * as M from "../index.ts"
import {
  definePrimitiveFunction,
  definePrimitiveVariable,
} from "../mod/define.ts"
import { type Mod } from "../mod/index.ts"

export function typeBuiltin(mod: Mod) {
  definePrimitiveVariable(mod, "type-t", M.TypeType())
  definePrimitiveVariable(mod, "int-t", M.AtomType("int"))
  definePrimitiveVariable(mod, "float-t", M.AtomType("float"))
  definePrimitiveVariable(mod, "string-t", M.AtomType("string"))
  definePrimitiveVariable(mod, "symbol-t", M.AtomType("symbol"))
  definePrimitiveVariable(mod, "keyword-t", M.AtomType("keyword"))
  definePrimitiveVariable(mod, "bool-t", M.AtomType("bool"))
  definePrimitiveVariable(mod, "void-t", M.AtomType("void"))
  definePrimitiveVariable(mod, "file-t", M.AtomType("file"))
  definePrimitiveFunction(mod, "list-t", 1, (E) => M.ListType(E))
  definePrimitiveFunction(mod, "set-t", 1, (E) => M.SetType(E))
  definePrimitiveFunction(mod, "hash-t", 2, (K, V) => M.HashType(K, V))
}
