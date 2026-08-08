import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { desugarAnd } from "./desugarAnd.ts"
import { desugarBegin } from "./desugarBegin.ts"
import { desugarChain } from "./desugarChain.ts"
import { desugarCompose } from "./desugarCompose.ts"
import { desugarCond } from "./desugarCond.ts"
import { desugarFlow } from "./desugarFlow.ts"
import { desugarHash } from "./desugarHash.ts"
import { desugarLet } from "./desugarLet.ts"
import { desugarLetrec } from "./desugarLetrec.ts"
import { desugarList } from "./desugarList.ts"
import { desugarOr } from "./desugarOr.ts"
import { desugarQuote } from "./desugarQuote.ts"
import { desugarSet } from "./desugarSet.ts"
import { desugarSexp } from "./desugarSexp.ts"
import { desugarSexpZh } from "./desugarSexpZh.ts"
import { desugarTextConcat } from "./desugarTextConcat.ts"

export function desugar(exp: M.Exp): M.Term {
  switch (exp.kind) {
    case "BeginExp": {
      return desugar(desugarBegin(exp.sequence, exp.location))
    }

    case "LocalDefineExp": {
      let message = `[desugar] local (define) must occur in the body of (begin)`
      message += `\n  exp: ${M.formatExp(exp)}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "WhenExp": {
      return M.IfTerm(
        desugar(exp.condition),
        M.Begin1Term(
          desugar(exp.consequent),
          M.QualifiedVarTerm("meta-builtin", "builtin", "void", exp.location),
          exp.location,
        ),
        M.QualifiedVarTerm("meta-builtin", "builtin", "void", exp.location),
        exp.location,
      )
    }

    case "UnlessExp": {
      return M.IfTerm(
        desugar(exp.condition),
        M.QualifiedVarTerm("meta-builtin", "builtin", "void", exp.location),
        M.Begin1Term(
          desugar(exp.alternative),
          M.QualifiedVarTerm("meta-builtin", "builtin", "void", exp.location),
          exp.location,
        ),
        exp.location,
      )
    }

    case "AndExp": {
      return desugar(desugarAnd(exp.exps, exp.location))
    }

    case "OrExp": {
      return desugar(desugarOr(exp.exps, exp.location))
    }

    case "CondExp": {
      return desugar(desugarCond(exp.clauses, exp.location))
    }

    case "ListExp": {
      return desugar(desugarList(exp.elements, exp.location))
    }

    case "SetExp": {
      return desugar(desugarSet(exp.elements, exp.location))
    }

    case "TextConcatExp": {
      return desugar(desugarTextConcat(exp.elements, exp.location))
    }

    case "HashExp": {
      return desugar(desugarHash(exp.entries, exp.location))
    }

    case "QuoteExp": {
      return desugar(desugarQuote(exp.sexp, exp.location))
    }

    case "SexpExp": {
      return desugar(
        exp.lang === "zh" ? desugarSexpZh(exp.sexp) : desugarSexp(exp.sexp),
      )
    }

    case "CommentExp": {
      return M.QualifiedVarTerm("meta-builtin", "builtin", "void", exp.location)
    }

    case "FlowExp": {
      return desugar(desugarFlow(exp.target, exp.steps, exp.location))
    }

    case "ChainExp": {
      return desugar(desugarChain(exp.steps, exp.location))
    }

    case "ComposeExp": {
      return desugar(desugarCompose(exp.steps, exp.location))
    }

    case "Begin1Exp": {
      return M.Begin1Term(desugar(exp.head), desugar(exp.body), exp.location)
    }

    case "LetExp": {
      return desugar(desugarLet(exp.bindings, exp.body, exp.location))
    }

    case "LetrecExp": {
      return desugar(desugarLetrec(exp.bindings, exp.body, exp.location))
    }

    case "LambdaExp": {
      return M.LambdaTerm(exp.parameters, desugar(exp.body), exp.location)
    }

    case "AllExp": {
      return M.AllTerm(exp.parameters, desugar(exp.body), exp.location)
    }

    case "SymbolExp": {
      return M.SymbolTerm(exp.content, exp.location)
    }

    case "KeywordExp": {
      return M.KeywordTerm(exp.content, exp.location)
    }

    case "StringExp": {
      return M.StringTerm(exp.content, exp.location)
    }

    case "IntExp": {
      return M.IntTerm(exp.content, exp.location)
    }

    case "FloatExp": {
      return M.FloatTerm(exp.content, exp.location)
    }

    case "VarExp": {
      return M.VarTerm(exp.name, exp.location)
    }

    case "QualifiedVarExp": {
      return M.QualifiedVarTerm(
        exp.pkgName,
        exp.modName,
        exp.name,
        exp.location,
      )
    }

    case "ApplyExp": {
      return M.ApplyTerm(
        desugar(exp.target),
        exp.args.map(desugar),
        exp.location,
      )
    }

    case "Let1Exp": {
      return M.Let1Term(
        exp.name,
        desugar(exp.rhs),
        desugar(exp.body),
        exp.location,
      )
    }

    case "IfExp": {
      return M.IfTerm(
        desugar(exp.condition),
        desugar(exp.consequent),
        desugar(exp.alternative),
        exp.location,
      )
    }

    case "ArrowExp": {
      return M.ArrowTerm(
        exp.argTypes.map(desugar),
        desugar(exp.retType),
        exp.location,
      )
    }

    case "TheExp": {
      return M.TheTerm(desugar(exp.type), desugar(exp.instance), exp.location)
    }

    // Should not appear after LowerMatchPass
    case "MatchExp": {
      let message = `[desugar] unexpected MatchExp`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
  }
}
