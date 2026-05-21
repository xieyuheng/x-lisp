import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { desugarAnd } from "./desugarAnd.ts"
import { desugarBegin } from "./desugarBegin.ts"
import { desugarChain } from "./desugarChain.ts"
import { desugarCompose } from "./desugarCompose.ts"
import { desugarCond } from "./desugarCond.ts"
import { desugarHash } from "./desugarHash.ts"
import { desugarLet } from "./desugarLet.ts"
import { desugarLetStar } from "./desugarLetStar.ts"
import { desugarLetrec } from "./desugarLetrec.ts"
import { desugarLetrecStar } from "./desugarLetrecStar.ts"
import { desugarList } from "./desugarList.ts"
import { desugarOr } from "./desugarOr.ts"
import { desugarPipe } from "./desugarPipe.ts"
import { desugarQuote } from "./desugarQuote.ts"
import { desugarSet } from "./desugarSet.ts"
import { type State } from "./desugarState.ts"

export function desugar(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "BeginExp": {
      return desugar(state, desugarBegin(exp.sequence, exp.location))
    }

    case "AssignExp": {
      let message = `[desugar] (=) must occur in the head of (begin)`
      message += `\n  exp: ${M.formatExp(exp)}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "LocalDefineExp": {
      let message = `[desugar] local (define) must occur in the body of (begin)`
      message += `\n  exp: ${M.formatExp(exp)}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "WhenExp": {
      return M.IfExp(
        desugar(state, exp.condition),
        M.Begin1Exp(
          desugar(state, exp.consequent),
          M.QualifiedVarExp("builtin", "void", exp.location),
          exp.location,
        ),
        M.QualifiedVarExp("builtin", "void", exp.location),
        exp.location,
      )
    }

    case "UnlessExp": {
      return M.IfExp(
        desugar(state, exp.condition),
        M.QualifiedVarExp("builtin", "void", exp.location),
        M.Begin1Exp(
          desugar(state, exp.alternative),
          M.QualifiedVarExp("builtin", "void", exp.location),
          exp.location,
        ),
        exp.location,
      )
    }

    case "AndExp": {
      return desugar(state, desugarAnd(exp.exps, exp.location))
    }

    case "OrExp": {
      return desugar(state, desugarOr(exp.exps, exp.location))
    }

    case "CondExp": {
      return desugar(state, desugarCond(exp.clauses, exp.location))
    }

    case "ListExp": {
      return desugar(state, desugarList(exp.elements, exp.location))
    }

    case "SetExp": {
      return desugar(state, desugarSet(exp.elements, exp.location))
    }

    case "HashExp": {
      return desugar(state, desugarHash(exp.entries, exp.location))
    }

    case "QuoteExp": {
      return desugar(state, desugarQuote(exp.sexp, exp.location))
    }

    case "PipeExp": {
      return desugar(state, desugarPipe(exp.target, exp.steps, exp.location))
    }

    case "ChainExp": {
      return desugar(state, desugarChain(exp.steps, exp.location))
    }

    case "ComposeExp": {
      return desugar(state, desugarCompose(exp.steps, exp.location))
    }

    case "Begin1Exp": {
      return M.Begin1Exp(
        desugar(state, exp.head),
        desugar(state, exp.body),
        exp.location,
      )
    }

    case "LetStarExp": {
      return desugar(
        state,
        desugarLetStar(exp.bindings, exp.body, exp.location),
      )
    }

    case "LetrecExp": {
      return desugar(state, desugarLetrec(exp.bindings, exp.body, exp.location))
    }

    case "LetrecStarExp": {
      return desugar(
        state,
        desugarLetrecStar(exp.bindings, exp.body, exp.location),
      )
    }

    case "LetExp": {
      return desugar(
        state,
        desugarLet(state, exp.bindings, exp.body, exp.location),
      )
    }

    case "LambdaExp": {
      return M.LambdaExp(exp.parameters, desugar(state, exp.body), exp.location)
    }

    case "PolymorphicExp": {
      return M.PolymorphicExp(
        exp.parameters,
        desugar(state, exp.body),
        exp.location,
      )
    }

    default: {
      return M.expTraverse((child) => desugar(state, child), exp)
    }
  }
}
