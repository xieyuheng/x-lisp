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
    case "PrimitiveFunctionDefinition": {
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
  const body =
    definition.parameters.length === 0
      ? F.Sequence(inTail(definition.body))
      : F.Sequence([
          F.Bindings(definition.parameters),
          ...inTail(definition.body),
        ])

  return [F.DefineFunction(definition.name, body)]
}

function onConstantDefinition(
  forthMod: F.Mod,
  definition: L.ConstantDefinition,
): Array<F.Stmt> {
  const body = F.Sequence(inTail(definition.body))
  return [F.DefineVariable(definition.name, body)]
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
    return [atomToAtom(exp), F.Return()]
  }

  switch (exp.kind) {
    case "Var": {
      return [F.Var(exp.name), F.Return()]
    }

    case "FunctionRef": {
      return [F.Ref(exp.name), F.Return()]
    }

    case "PrimitiveFunctionRef": {
      return [F.Ref(exp.name), F.Return()]
    }

    case "ConstantRef": {
      return [F.Var(exp.name), F.Return()]
    }

    case "Apply": {
      if (
        (exp.target.kind === "FunctionRef" ||
          exp.target.kind === "PrimitiveFunctionRef") &&
        exp.args.length === exp.target.arity
      ) {
        return [...exp.args.flatMap(inBody), F.TailCall(exp.target.name)]
      } else if (
        (exp.target.kind === "FunctionRef" ||
          exp.target.kind === "PrimitiveFunctionRef") &&
        exp.args.length > exp.target.arity
      ) {
        return [
          ...exp.args.slice(exp.target.arity, exp.args.length).flatMap(inBody),
          ...exp.args.slice(0, exp.target.arity).flatMap(inBody),
          F.TailCall(exp.target.name),
          F.Int(BigInt(exp.args.length - exp.target.arity)),
          F.TailApply(),
        ]
      } else {
        return [
          ...exp.args.flatMap(inBody),
          ...inBody(exp.target),
          F.Int(BigInt(exp.args.length)),
          F.TailApply(),
        ]
      }
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
      return [F.Var(exp.name)]
    }

    case "FunctionRef": {
      return [F.Ref(exp.name)]
    }

    case "PrimitiveFunctionRef": {
      return [F.Ref(exp.name)]
    }

    case "ConstantRef": {
      return [F.Var(exp.name)]
    }

    case "Apply": {
      if (
        (exp.target.kind === "FunctionRef" ||
          exp.target.kind === "PrimitiveFunctionRef") &&
        exp.args.length === exp.target.arity
      ) {
        return [...exp.args.flatMap(inBody), F.Var(exp.target.name)]
      } else if (
        (exp.target.kind === "FunctionRef" ||
          exp.target.kind === "PrimitiveFunctionRef") &&
        exp.args.length > exp.target.arity
      ) {
        return [
          ...exp.args.slice(exp.target.arity, exp.args.length).flatMap(inBody),
          ...exp.args.slice(0, exp.target.arity).flatMap(inBody),
          F.Var(exp.target.name),
          F.Int(BigInt(exp.args.length - exp.target.arity)),
          F.Apply(),
        ]
      } else {
        return [
          ...exp.args.flatMap(inBody),
          ...inBody(exp.target),
          F.Int(BigInt(exp.args.length)),
          F.Apply(),
        ]
      }
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
