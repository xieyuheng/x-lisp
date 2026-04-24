import { setUnion } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

// - can not handle `Match`, must be called after `desugar`.

export function qualifyFreeVar(
  mod: M.Mod,
  boundNames: Set<string>,
  exp: M.Exp,
): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "Quote": {
      return exp
    }

    case "QualifiedVar": {
      return exp
    }

    case "Var": {
      if (boundNames.has(exp.name)) {
        return exp
      }

      const builtinMod = M.loadBuiltinMod(mod.project)

      const definition = M.modLookupDefinition(builtinMod, exp.name)
      if (definition) {
        return M.QualifiedVar(builtinMod.name, exp.name, exp.location)
      }

      const claimedType = M.modLookupClaimedType(builtinMod, exp.name)
      if (claimedType) {
        return M.QualifiedVar(builtinMod.name, exp.name, exp.location)
      }

      return M.QualifiedVar(mod.name, exp.name, exp.location)
    }

    // no need to avoid free variable in lhs

    case "Lambda": {
      return M.Lambda(
        exp.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(exp.parameters)),
          exp.body,
        ),
        exp.location,
      )
    }

    case "Polymorphic": {
      return M.Polymorphic(
        exp.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(exp.parameters)),
          exp.body,
        ),
        exp.location,
      )
    }

    case "Let1": {
      return M.Let1(
        exp.name,
        qualifyFreeVar(mod, boundNames, exp.rhs),
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set([exp.name])),
          exp.body,
        ),
        exp.location,
      )
    }

    default: {
      return M.expTraverse(
        (child) => qualifyFreeVar(mod, boundNames, child),
        exp,
      )
    }
  }
}
