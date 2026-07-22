import * as M from "../../meta/index.ts"
import {
  ApplyTerm,
  Begin1Term,
  FloatTerm,
  IfTerm,
  IntTerm,
  KeywordTerm,
  LambdaTerm,
  Let1Term,
  QualifiedVarTerm,
  StringTerm,
  SymbolTerm,
  VarTerm,
  type Term,
} from "./Term.ts"

export function termSubstDeepWalk(subst: M.Subst, term: Term): Term {
  switch (term.kind) {
    case "VarTerm":
      return VarTerm(
        term.name,
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "QualifiedVarTerm":
      return QualifiedVarTerm(
        term.pkgName,
        term.modName,
        term.name,
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "LambdaTerm":
      return LambdaTerm(
        term.parameters.map((p) => ({
          name: p.name,
          type: M.substDeepWalk(subst, p.type),
        })),
        termSubstDeepWalk(subst, term.body),
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "ApplyTerm":
      return ApplyTerm(
        termSubstDeepWalk(subst, term.target),
        term.args.map((a) => termSubstDeepWalk(subst, a)),
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "Let1Term":
      return Let1Term(
        term.name,
        termSubstDeepWalk(subst, term.rhs),
        termSubstDeepWalk(subst, term.body),
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "Begin1Term":
      return Begin1Term(
        termSubstDeepWalk(subst, term.head),
        termSubstDeepWalk(subst, term.body),
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "IfTerm":
      return IfTerm(
        termSubstDeepWalk(subst, term.condition),
        termSubstDeepWalk(subst, term.consequent),
        termSubstDeepWalk(subst, term.alternative),
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "IntTerm":
      return IntTerm(
        term.content,
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "FloatTerm":
      return FloatTerm(
        term.content,
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "StringTerm":
      return StringTerm(
        term.content,
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "SymbolTerm":
      return SymbolTerm(
        term.content,
        M.substDeepWalk(subst, term.type),
        term.location,
      )
    case "KeywordTerm":
      return KeywordTerm(
        term.content,
        M.substDeepWalk(subst, term.type),
        term.location,
      )
  }
}
