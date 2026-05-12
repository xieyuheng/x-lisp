import * as M from "../index.ts"
import { type Type } from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function typeBuiltin(mod: Mod) {
  M.modDefine(
    mod,
    "type-t",
    M.PrimitiveVariableDefinition(mod, "type-t", M.TypeType()),
  )
  mod.claimed.set("type-t", {
    exp: M.QualifiedVar("builtin", "type-t"),
    type: M.TypeType(),
  })

  const atomNames = [
    "int",
    "float",
    "string",
    "symbol",
    "keyword",
    "bool",
    "void",
    "file",
  ]
  for (const name of atomNames) {
    M.modDefine(
      mod,
      `${name}-t`,
      M.PrimitiveVariableDefinition(mod, `${name}-t`, M.AtomType(name)),
    )
  }

  M.modDefine(
    mod,
    "list-t",
    M.PrimitiveFunctionDefinition(mod, "list-t", 1, (...args: Array<Type>) =>
      M.ListType(args[0]),
    ),
  )

  M.modDefine(
    mod,
    "set-t",
    M.PrimitiveFunctionDefinition(mod, "set-t", 1, (...args: Array<Type>) =>
      M.SetType(args[0]),
    ),
  )

  M.modDefine(
    mod,
    "hash-t",
    M.PrimitiveFunctionDefinition(mod, "hash-t", 2, (...args: Array<Type>) =>
      M.HashType(args[0], args[1]),
    ),
  )
}
