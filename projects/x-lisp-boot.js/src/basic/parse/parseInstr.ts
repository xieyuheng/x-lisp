import * as S from "@xieyuheng/sexp.js"
import * as Instrs from "../instr/index.ts"
import { type Instr } from "../instr/index.ts"
import * as Values from "../value/index.ts"
import { parseValue } from "./parseValue.ts"

export function parseInstr(sexp: S.Sexp): Instr {
  return S.match(
    S.matcherChoice<Instr>([
      S.matcher("`(= ,dest (argument ,index))", ({ dest, index }, { meta }) => {
        return Instrs.Argument(
          S.symbolContent(dest),
          Number(S.intContent(index)),
          meta,
        )
      }),

      S.matcher("`(= ,dest (literal ,value))", ({ dest, value }, { meta }) => {
        return Instrs.Literal(S.symbolContent(dest), parseValue(value), meta)
      }),

      S.matcher(
        "`(= ,dest (identity ,source))",
        ({ dest, source }, { meta }) => {
          return Instrs.Identity(
            S.symbolContent(dest),
            S.symbolContent(source),
            meta,
          )
        },
      ),

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

      S.matcher("(cons* 'call fn args)", ({ fn, args }, { meta }) => {
        return Instrs.Call(
          "_∅",
          Values.asFunction(parseValue(fn)),
          S.listElements(args).map(S.symbolContent),
          meta,
        )
      }),

      S.matcher(
        "`(= ,dest ,(cons* 'call fn args))",
        ({ fn, args, dest }, { meta }) => {
          return Instrs.Call(
            S.symbolContent(dest),
            Values.asFunction(parseValue(fn)),
            S.listElements(args).map(S.symbolContent),
            meta,
          )
        },
      ),

      S.matcher("`(apply ,target ,arg)", ({ target, arg }, { meta }) => {
        return Instrs.Apply(
          "_∅",
          S.symbolContent(target),
          S.symbolContent(arg),
          meta,
        )
      }),

      S.matcher(
        "`(= ,dest (apply ,target ,arg))",
        ({ target, arg, dest }, { meta }) => {
          return Instrs.Apply(
            S.symbolContent(dest),
            S.symbolContent(target),
            S.symbolContent(arg),
            meta,
          )
        },
      ),

      S.matcher("`(apply-nullary ,target)", ({ target }, { meta }) => {
        return Instrs.ApplyNullary("_∅", S.symbolContent(target), meta)
      }),

      S.matcher(
        "`(= ,dest (apply-nullary ,target))",
        ({ target, arg, dest }, { meta }) => {
          return Instrs.ApplyNullary(
            S.symbolContent(dest),
            S.symbolContent(target),
            meta,
          )
        },
      ),

      S.matcher("`(= ,dest (load ,name))", ({ dest, name }, { meta }) => {
        return Instrs.Load(S.symbolContent(dest), S.symbolContent(name), meta)
      }),

      S.matcher("`(store ,name, source)", ({ name, source }, { meta }) => {
        return Instrs.Store(
          S.symbolContent(name),
          S.symbolContent(source),
          meta,
        )
      }),
    ]),
    sexp,
  )
}
