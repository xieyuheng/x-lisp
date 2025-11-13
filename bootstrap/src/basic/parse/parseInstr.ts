import * as S from "@xieyuheng/x-sexp.js"
import * as Instrs from "../instr/index.ts"
import { type Instr } from "../instr/index.ts"
import { parseValue } from "./parseValue.ts"

export function parseInstr(sexp: S.Sexp): Instr {
  return S.match(
    S.matcherChoice<Instr>([
      S.matcher("`(= ,dest (argument ,index))", ({ dest, index }, { meta }) => {
        return Instrs.Argument(
          S.numberContent(index),
          S.symbolContent(dest),
          meta,
        )
      }),

      S.matcher("`(= ,dest (const ,value))", ({ dest, value }, { meta }) => {
        return Instrs.Const(parseValue(value), S.symbolContent(dest), meta)
      }),

      S.matcher("`(assert ,ok)", ({ ok }, { meta }) => {
        return Instrs.Assert(S.symbolContent(ok), meta)
      }),

      S.matcher("`(goto ,label)", ({ label }, { meta }) => {
        return Instrs.Goto(S.symbolContent(label), meta)
      }),

      S.matcher("`(return ,result)", ({ result }, { meta }) => {
        return Instrs.Return(S.symbolContent(result), meta)
      }),

      S.matcher("`(return)", ({}, { meta }) => {
        return Instrs.Return(undefined, meta)
      }),

      S.matcher(
        "`(branch ,condition ,thenLabel ,elseLabel)",
        ({ condition, thenLabel, elseLabel }, { meta }) => {
          return Instrs.Branch(
            S.symbolContent(condition),
            S.symbolContent(thenLabel),
            S.symbolContent(elseLabel),
            meta,
          )
        },
      ),

      S.matcher("(cons* 'call target args)", ({ target, args }, { meta }) => {
        return Instrs.Call(
          S.symbolContent(target),
          S.listElements(args).map(S.symbolContent),
          undefined,
          meta,
        )
      }),

      S.matcher(
        "`(= ,dest ,(cons* 'call target args))",
        ({ target, args, dest }, { meta }) => {
          return Instrs.Call(
            S.symbolContent(target),
            S.listElements(args).map(S.symbolContent),
            S.symbolContent(dest),
            meta,
          )
        },
      ),

      S.matcher("`(apply ,target ,arg)", ({ target, arg }, { meta }) => {
        return Instrs.Apply(
          S.symbolContent(target),
          S.symbolContent(arg),
          undefined,
          meta,
        )
      }),

      S.matcher(
        "`(= ,dest (apply ,target ,arg))",
        ({ target, arg, dest }, { meta }) => {
          return Instrs.Apply(
            S.symbolContent(target),
            S.symbolContent(arg),
            S.symbolContent(dest),
            meta,
          )
        },
      ),

      S.matcher("`(nullary-apply ,target)", ({ target }, { meta }) => {
        return Instrs.NullaryApply(S.symbolContent(target), undefined, meta)
      }),

      S.matcher(
        "`(= ,dest (nullary-apply ,target))",
        ({ target, arg, dest }, { meta }) => {
          return Instrs.NullaryApply(
            S.symbolContent(target),
            S.symbolContent(dest),
            meta,
          )
        },
      ),
    ]),
    sexp,
  )
}
