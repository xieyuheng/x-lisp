import * as X from "@xieyuheng/x-sexp.js"
import type { Instr } from "../instr/index.ts"
import * as Instrs from "../instr/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function matchInstr(sexp: X.Sexp): Instr {
  return X.match(
    X.matcherChoice<Instr>([
      X.matcher(
        "`(= ,dest (const ,value))",
        ({ dest, value }, { sexp, meta }) => {
          return Instrs.Const(matchValue(value), X.symbolContent(dest), meta)
        },
      ),

      X.matcher("`(goto ,label)", ({ label }, { sexp, meta }) => {
        return Instrs.Goto(X.symbolContent(label), meta)
      }),

      X.matcher("`(return ,result)", ({ result }, { sexp, meta }) => {
        return Instrs.Return([X.symbolContent(result)], meta)
      }),

      X.matcher("`(return)", ({}, { sexp, meta }) => {
        return Instrs.Return([], meta)
      }),

      X.matcher(
        "`(branch ,condition ,thenLabel ,elseLabel)",
        ({ condition, thenLabel, elseLabel }, { sexp, meta }) => {
          return Instrs.Branch(
            [X.symbolContent(condition)],
            X.symbolContent(thenLabel),
            X.symbolContent(elseLabel),
            meta,
          )
        },
      ),

      X.matcher(
        "(cons* 'call target operands)",
        ({ target, operands }, { sexp, meta }) => {
          return Instrs.Call(
            X.symbolContent(target),
            X.listElements(operands).map(X.symbolContent),
            undefined,
            meta,
          )
        },
      ),

      X.matcher(
        "`(= ,dest ,(cons* 'call target operands))",
        ({ target, operands, dest }, { sexp, meta }) => {
          return Instrs.Call(
            X.symbolContent(target),
            X.listElements(operands).map(X.symbolContent),
            X.symbolContent(dest),
            meta,
          )
        },
      ),
    ]),
    sexp,
  )
}

function matchValue(sexp: X.Sexp): Value {
  const meta = X.tokenMetaFromSexpMeta(sexp.meta)

  switch (sexp.kind) {
    case "Hashtag": {
      const content = X.hashtagContent(sexp)
      if (content === "t") {
        return Values.Bool(true)
      } else if (content === "f") {
        return Values.Bool(false)
      } else if (content === "void") {
        return Values.Void()
      } else {
        let message = `[matchValue] unknown hashtag`
        message += `\n  hashtag: #${content}`
        throw new X.ErrorWithMeta(message, meta)
      }
    }

    case "Int": {
      return Values.Int(X.numberContent(sexp))
    }

    case "Float": {
      return Values.Float(X.numberContent(sexp))
    }

    default: {
      let message = `[matchValue] unknown sexp`
      message += `\n  sexp: #${X.formatSexp(sexp)}`
      throw new X.ErrorWithMeta(message, meta)
    }
  }
}
