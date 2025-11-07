import * as S from "@xieyuheng/x-sexp.js"
import * as Instrs from "../instr/index.ts"
import { type Instr } from "../instr/index.ts"
import { parseValue } from "./parseValue.ts"

export function parseInstr(sexp: S.Sexp): Instr {
  return S.match(
    S.matcherChoice<Instr>([
      S.matcher(
        "`(= ,dest (argument ,index))",
        ({ dest, index }, { sexp, meta }) => {
          return Instrs.Argument(
            S.numberContent(index),
            S.symbolContent(dest),
            meta,
          )
        },
      ),

      S.matcher(
        "`(= ,dest (const ,value))",
        ({ dest, value }, { sexp, meta }) => {
          return Instrs.Const(parseValue(value), S.symbolContent(dest), meta)
        },
      ),

      S.matcher("`(assert ,ok)", ({ ok }, { sexp, meta }) => {
        return Instrs.Assert([S.symbolContent(ok)], meta)
      }),

      S.matcher("`(goto ,label)", ({ label }, { sexp, meta }) => {
        return Instrs.Goto(S.symbolContent(label), meta)
      }),

      S.matcher("`(return ,result)", ({ result }, { sexp, meta }) => {
        return Instrs.Return([S.symbolContent(result)], meta)
      }),

      S.matcher("`(return)", ({}, { sexp, meta }) => {
        return Instrs.Return([], meta)
      }),

      S.matcher(
        "`(branch ,condition ,thenLabel ,elseLabel)",
        ({ condition, thenLabel, elseLabel }, { sexp, meta }) => {
          return Instrs.Branch(
            [S.symbolContent(condition)],
            S.symbolContent(thenLabel),
            S.symbolContent(elseLabel),
            meta,
          )
        },
      ),

      S.matcher(
        "(cons* 'call target operands)",
        ({ target, operands }, { sexp, meta }) => {
          return Instrs.Call(
            S.symbolContent(target),
            S.listElements(operands).map(S.symbolContent),
            undefined,
            meta,
          )
        },
      ),

      S.matcher(
        "`(= ,dest ,(cons* 'call target operands))",
        ({ target, operands, dest }, { sexp, meta }) => {
          return Instrs.Call(
            S.symbolContent(target),
            S.listElements(operands).map(S.symbolContent),
            S.symbolContent(dest),
            meta,
          )
        },
      ),

      S.matcher("(cons* 'apply operands)", ({ operands }, { sexp, meta }) => {
        return Instrs.Apply(
          S.listElements(operands).map(S.symbolContent),
          undefined,
          meta,
        )
      }),

      S.matcher(
        "`(= ,dest ,(cons* 'apply operands))",
        ({ operands, dest }, { sexp, meta }) => {
          return Instrs.Apply(
            S.listElements(operands).map(S.symbolContent),
            S.symbolContent(dest),
            meta,
          )
        },
      ),
    ]),
    sexp,
  )
}
