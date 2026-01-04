import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as L from "../lisp/index.ts"
import * as F from "../forth/index.ts"

export function ExplicateControlPass(mod: L.Mod, forthMod: F.Mod): void {
  for (const stmt of mod.stmts) {
    if (L.isAboutModule(stmt)) {
      forthMod.stmts.push(stmt)
    }
  }

  for (const definition of L.modOwnDefinitions(mod)) {
    const stmts = onDefinition(forthMod, definition)
    forthMod.stmts.push(...stmts)
  }
}

function onDefinition(
  forthMod: F.Mod,
  definition: L.Definition,
): Array<F.Stmt> {
  switch (definition.kind) {
    case "PrimitiveDefinition": {
      return []
    }

    case "FunctionDefinition": {
      return onFunctionDefinition(forthMod, definition)
    }

    case "ConstantDefinition": {
      return onConstantDefinition(forthMod, definition)
    }
  }
}

function onFunctionDefinition(
  forthMod: F.Mod,
  definition: L.FunctionDefinition,
): Array<F.Stmt> {
  return []
}

function onConstantDefinition(
  forthMod: F.Mod,
  definition: L.ConstantDefinition,
): Array<F.Stmt> {
  return []
}
