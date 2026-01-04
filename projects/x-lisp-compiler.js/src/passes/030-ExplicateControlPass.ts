import * as F from "../forth/index.ts"
import * as L from "../lisp/index.ts"

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
  return [
    F.DefineFunction(
      definition.name,
      F.Sequence([
        F.Bindings(definition.parameters),
        ...inTail(definition.body),
      ]),
    ),
  ]
}

function onConstantDefinition(
  forthMod: F.Mod,
  definition: L.ConstantDefinition,
): Array<F.Stmt> {
  return [
    F.DefineVariable(definition.name, F.Sequence(inTail(definition.body))),
  ]
}

function inTail(exp: L.Exp): Array<F.Exp> {
  return []

  // switch (exp.kind) {
  // }
}
