import * as X from "@xieyuheng/x-sexp.js"
import { Block } from "../block/index.ts"
import type { Instr, Operand } from "../instr/index.ts"
import * as Operands from "../instr/Operand.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import * as Values from "../value/index.ts"

export function matchStmt(sexp: X.Sexp): Stmt {
  return X.match(stmtMatcher, sexp)
}

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define (cons* name parameters) blocks)",
    ({ name, parameters, blocks }, { sexp }) => {
      return Stmts.DefineFunction(
        X.symbolContent(name),
        X.listElements(parameters).map(X.symbolContent),
        new Map(
          X.listElements(blocks)
            .map(matchBlock)
            .map((block) => [block.label, block]),
        ),
      )
    },
  ),
])

function matchBlock(sexp: X.Sexp): Block {
  return X.match(
    X.matcher("(cons* 'block label instrs)", ({ label, instrs }, { sexp }) => {
      return Block(
        X.symbolContent(label),
        X.listElements(instrs).map(matchInstr),
      )
    }),
    sexp,
  )
}

function matchInstr(sexp: X.Sexp): Instr {
  return X.match(
    X.matcherChoice<Instr>([
      X.matcher(
        "`(= ,dest ,(cons* op operands))",
        ({ dest, op, operands }, { sexp }) => {
          return {
            dest: X.symbolContent(dest),
            op: X.symbolContent(op),
            operands: X.listElements(operands).map(matchOperand),
          }
        },
      ),

      X.matcher("(cons* op operands)", ({ dest, op, operands }, { sexp }) => {
        return {
          op: X.symbolContent(op),
          operands: X.listElements(operands).map(matchOperand),
        }
      }),
    ]),
    sexp,
  )
}

function matchOperand(sexp: X.Sexp): Operand {
  return X.match(
    X.matcher("data", ({ data }, { meta }) => {
      switch (data.kind) {
        case "Int":
          return Operands.Imm(Values.Int(X.numberContent(data)))
        case "Float":
          return Operands.Imm(Values.Float(X.numberContent(data)))
        case "Symbol": {
          return Operands.Var(X.symbolContent(data))
        }
      }
    }),
    sexp,
  )
}
