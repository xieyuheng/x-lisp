import * as S from "@xieyuheng/sexp.js"
import * as Instrs from "../instr/index.ts"
import { type Instr } from "../instr/index.ts"
import * as Values from "../value/index.ts"
import { parseValue } from "./parseValue.ts"

export const parseInstr = S.createRouter<Instr>({
  "`(= ,dest (argument ,index))": ({ dest, index }, { meta }) => {
    return Instrs.Argument(
      S.symbolContent(dest),
      Number(S.intContent(index)),
      meta,
    )
  },

  "`(= ,dest (literal ,value))": ({ dest, value }, { meta }) => {
    return Instrs.Literal(S.symbolContent(dest), parseValue(value), meta)
  },

  "`(= ,dest (identity ,source))": ({ dest, source }, { meta }) => {
    return Instrs.Identity(S.symbolContent(dest), S.symbolContent(source), meta)
  },

  "`(assert ,ok)": ({ ok }, { meta }) => {
    return Instrs.Assert(S.symbolContent(ok), meta)
  },

  "`(goto ,label)": ({ label }, { meta }) => {
    return Instrs.Goto(S.symbolContent(label), meta)
  },

  "`(return ,result)": ({ result }, { meta }) => {
    return Instrs.Return(S.symbolContent(result), meta)
  },

  "`(return)": ({}, { meta }) => {
    return Instrs.Return(undefined, meta)
  },

  "`(branch ,condition ,thenLabel ,elseLabel)": (
    { condition, thenLabel, elseLabel },
    { meta },
  ) => {
    return Instrs.Branch(
      S.symbolContent(condition),
      S.symbolContent(thenLabel),
      S.symbolContent(elseLabel),
      meta,
    )
  },

  "(cons* 'call fn args)": ({ fn, args }, { meta }) => {
    return Instrs.Call(
      "_∅",
      Values.asFunction(parseValue(fn)),
      S.listElements(args).map(S.symbolContent),
      meta,
    )
  },

  "`(= ,dest ,(cons* 'call fn args))": ({ fn, args, dest }, { meta }) => {
    return Instrs.Call(
      S.symbolContent(dest),
      Values.asFunction(parseValue(fn)),
      S.listElements(args).map(S.symbolContent),
      meta,
    )
  },

  "`(apply ,target ,arg)": ({ target, arg }, { meta }) => {
    return Instrs.Apply(
      "_∅",
      S.symbolContent(target),
      S.symbolContent(arg),
      meta,
    )
  },

  "`(= ,dest (apply ,target ,arg))": ({ target, arg, dest }, { meta }) => {
    return Instrs.Apply(
      S.symbolContent(dest),
      S.symbolContent(target),
      S.symbolContent(arg),
      meta,
    )
  },

  "`(apply-nullary ,target)": ({ target }, { meta }) => {
    return Instrs.ApplyNullary("_∅", S.symbolContent(target), meta)
  },

  "`(= ,dest (apply-nullary ,target))": ({ target, arg, dest }, { meta }) => {
    return Instrs.ApplyNullary(
      S.symbolContent(dest),
      S.symbolContent(target),
      meta,
    )
  },

  "`(= ,dest (load ,name))": ({ dest, name }, { meta }) => {
    return Instrs.Load(S.symbolContent(dest), S.symbolContent(name), meta)
  },

  "`(store ,name, source)": ({ name, source }, { meta }) => {
    return Instrs.Store(S.symbolContent(name), S.symbolContent(source), meta)
  },
})
