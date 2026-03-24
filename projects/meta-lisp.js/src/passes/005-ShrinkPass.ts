import * as S from "@xieyuheng/sexp.js"
import * as M from "../meta/index.ts"

export function ShrinkPass(mod: M.Mod): void {
  for (const definition of M.modOwnDefinitions(mod)) {
    onDefinition(mod, definition)
  }
}

function onDefinition(mod: M.Mod, definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "DataDefinition":
    case "InterfaceDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition": {
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
    case "Require": {
      return exp
    }

    case "The": {
      return onExp(mod, M.desugar(mod, exp.exp))
    }

    case "LiteralTuple": {
      return onExp(mod, shrinkTuple(mod, exp.elements, exp.meta))
    }

    case "LiteralRecord": {
      return onExp(mod, shrinkRecord(mod, exp.attributes, exp.meta))
    }

    case "Extend": {
      return onExp(mod, shrinkUpdate(mod, exp.base, exp.attributes, exp.meta))
    }

    case "Update": {
      return onExp(mod, shrinkUpdate(mod, exp.base, exp.attributes, exp.meta))
    }

    case "UpdateMut": {
      return onExp(
        mod,
        shrinkUpdateMut(mod, exp.base, exp.attributes, exp.meta),
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
  meta?: S.TokenMeta,
): M.Exp {
  return M.desugar(mod, M.desugarList(elements, meta))
}

function shrinkRecord(
  mod: M.Mod,
  attributes: Record<string, M.Exp>,
  meta?: S.TokenMeta,
): M.Exp {
  const base = M.Apply(M.Var("make-record", meta), [], meta)
  return shrinkUpdateMut(mod, base, attributes, meta)
}

function shrinkUpdateMut(
  mod: M.Mod,
  base: M.Exp,
  attributes: Record<string, M.Exp>,
  meta?: S.TokenMeta,
): M.Exp {
  return M.desugar(
    mod,
    M.BeginSugar(
      [
        M.AssignSugar("record", base, meta),
        ...Object.entries(attributes).map(([key, value]) =>
          M.Apply(
            M.Var("record-put!", meta),
            [M.Keyword(key), value, M.Var("record", meta)],
            meta,
          ),
        ),
        M.Var("record", meta),
      ],
      meta,
    ),
  )
}

function shrinkUpdate(
  mod: M.Mod,
  base: M.Exp,
  attributes: Record<string, M.Exp>,
  meta?: S.TokenMeta,
): M.Exp {
  return M.desugar(
    mod,
    M.BeginSugar(
      [
        M.AssignSugar("record", base, meta),
        ...Object.entries(attributes).map(([key, value]) =>
          M.Apply(
            M.Var("record-put", meta),
            [M.Keyword(key), value, M.Var("record", meta)],
            meta,
          ),
        ),
        M.Var("record", meta),
      ],
      meta,
    ),
  )
}
