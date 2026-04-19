import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ShrinkPass(mod: M.Mod): void {
  for (const definition of M.modOwnDefinitions(mod)) {
    onDefinition(mod, definition)
  }
}

function onDefinition(mod: M.Mod, definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "DataDefinition":
    case "InterfaceDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      definition.body = onExp(mod, definition.body)
      return null
    }
  }
}

function onExp(mod: M.Mod, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Var":
    case "QualifiedVar": {
      return exp
    }

    case "Apply": {
      if (exp.target.kind === "Keyword") {
        return onExp(
          mod,
          M.Apply(
            M.Apply(M.QualifiedVar("builtin", "record-get", exp.location), [
              exp.target,
            ]),
            exp.args,
            exp.location,
          ),
        )
      }

      return M.expTraverse((e) => onExp(mod, e), exp)
    }

    case "The": {
      return onExp(mod, M.desugar(mod, exp.exp))
    }

    case "LiteralRecord": {
      return onExp(mod, shrinkRecord(mod, exp.attributes, exp.location))
    }

    case "Extend": {
      return onExp(
        mod,
        shrinkUpdate(mod, exp.base, exp.attributes, exp.location),
      )
    }

    case "Update": {
      return onExp(
        mod,
        shrinkUpdate(mod, exp.base, exp.attributes, exp.location),
      )
    }

    case "UpdateMut": {
      return onExp(
        mod,
        shrinkUpdateMut(mod, exp.base, exp.attributes, exp.location),
      )
    }

    default: {
      return M.expTraverse((e) => onExp(mod, e), exp)
    }
  }
}

function shrinkTuple(
  mod: M.Mod,
  elements: Array<M.Exp>,
  location?: S.SourceLocation,
): M.Exp {
  return M.desugar(mod, M.desugarList(elements, location))
}

function shrinkRecord(
  mod: M.Mod,
  attributes: Record<string, M.Exp>,
  location?: S.SourceLocation,
): M.Exp {
  const base = M.Apply(
    M.QualifiedVar("builtin", "make-record", location),
    [],
    location,
  )
  return shrinkUpdateMut(mod, base, attributes, location)
}

function shrinkUpdateMut(
  mod: M.Mod,
  base: M.Exp,
  attributes: Record<string, M.Exp>,
  location?: S.SourceLocation,
): M.Exp {
  return M.desugar(
    mod,
    M.BeginSugar(
      [
        M.AssignSugar("record", base, location),
        ...Object.entries(attributes).map(([key, value]) =>
          M.Apply(
            M.QualifiedVar("builtin", "record-put!", location),
            [M.Keyword(key), value, M.Var("record", location)],
            location,
          ),
        ),
        M.Var("record", location),
      ],
      location,
    ),
  )
}

function shrinkUpdate(
  mod: M.Mod,
  base: M.Exp,
  attributes: Record<string, M.Exp>,
  location?: S.SourceLocation,
): M.Exp {
  return M.desugar(
    mod,
    M.BeginSugar(
      [
        M.AssignSugar("record", base, location),
        ...Object.entries(attributes).map(([key, value]) =>
          M.AssignSugar(
            "record",
            M.Apply(
              M.QualifiedVar("builtin", "record-put", location),
              [M.Keyword(key), value, M.Var("record", location)],
              location,
            ),
            location,
          ),
        ),
        M.Var("record", location),
      ],
      location,
    ),
  )
}
