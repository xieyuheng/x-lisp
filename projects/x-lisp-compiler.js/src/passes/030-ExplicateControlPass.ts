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

function atomToAtom(atom: L.Atom): F.Atom {
  switch (atom.kind) {
    case "Symbol": {
      return F.Symbol(atom.content)
    }

    case "Hashtag": {
      return F.Hashtag(atom.content)
    }

    case "String": {
      return F.String(atom.content)
    }

    case "Int": {
      return F.Int(atom.content)
    }

    case "Float": {
      return F.Float(atom.content)
    }
  }
}

function inTail(exp: L.Exp): Array<F.Exp> {
  if (L.isAtom(exp)) {
    return [atomToAtom(exp)]
  }

  switch (exp.kind) {
    case "Var": {
      return [F.Call(exp.name)]
    }

    case "FunctionRef": {
      return [F.Ref(exp.name)]
    }

    case "PrimitiveRef": {
      return [F.Ref(exp.name)]
    }

    case "ConstantRef": {
      return [F.Call(exp.name)]
    }

    case "Apply": {
      return []
    }

    case "Let1": {
      return [...inBody(exp.rhs), F.Bindings([exp.name]), ...inTail(exp.body)]
    }

    case "Begin1": {
      return [...inBody(exp.head), ...inTail(exp.body)]
    }

    case "If": {
      return [
        F.If(
          F.Sequence(inTail(exp.consequent)),
          F.Sequence(inTail(exp.alternative)),
        ),
      ]
    }

    default: {
      let message = `[ExplicateControlPass] [inTail] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      throw new Error(message)
    }
  }
}

function inBody(exp: L.Exp): Array<F.Exp> {
  if (L.isAtom(exp)) {
    return [atomToAtom(exp)]
  }

  switch (exp.kind) {
    case "Var": {
      return [F.Call(exp.name)]
    }

    case "FunctionRef": {
      return [F.Ref(exp.name)]
    }

    case "PrimitiveRef": {
      return [F.Ref(exp.name)]
    }

    case "ConstantRef": {
      return [F.Call(exp.name)]
    }

    case "Apply": {
      return []
    }

    case "Let1": {
      return [...inBody(exp.rhs), F.Bindings([exp.name]), ...inBody(exp.body)]
    }

    case "Begin1": {
      return [...inBody(exp.head), ...inBody(exp.body)]
    }

    case "If": {
      return [
        F.If(
          F.Sequence(inBody(exp.consequent)),
          F.Sequence(inBody(exp.alternative)),
        ),
      ]
    }

    default: {
      let message = `[ExplicateControlPass] [inBody] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      throw new Error(message)
    }
  }
}
