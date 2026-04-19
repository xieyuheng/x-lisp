import * as B from "../../basic/index.ts"
import * as L from "../../linn/index.ts"
import * as M from "../index.ts"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import { getCompileCacheDir } from "node:module"

export function CodegenPass(basicMod: B.Mod, linnMod: L.Mod): void {
  for (const stmt of basicMod.stmts) {
    linnMod.lines.push(...onStmt(stmt))
  }
}

function onStmt(stmt: B.Stmt): Array<L.Line> {
  switch (stmt.kind) {
    case "DefineFunction": {
      // TODO parameters
      // TODO arity
      const blocks = stmt.blocks.values()
      return Array.from(blocks.flatMap((block) => onBlock(stmt.name, block)))
    }

    case "DefineVariable": {
      // TODO is variable
      const blocks = stmt.blocks.values()
      return Array.from(blocks.flatMap((block) => onBlock(stmt.name, block)))
    }
  }
}

function onBlock(name: string, block: B.Block): Array<L.Line> {
  return block.instrs.flatMap((instr) => onInstr(name, instr))
}

function onInstr(name: string, instr: B.Instr): Array<L.Line> {
  switch (instr.kind) {
    case "Assign": {
      return [
        ...onExp(name, instr.exp),
        L.Line("ins", name, [L.Var("local-store"), L.Var(instr.dest)]),
      ]
    }

    case "Perform": {
      return [...onExp(name, instr.exp), L.Line("ins", name, [L.Var("drop")])]
    }

    case "Test": {
      return onExp(name, instr.exp)
    }

    case "Branch": {
      return [
        L.Line("ins", name, [L.Var("jump-if-not"), L.Var(instr.elseLabel)]),
        L.Line("ins", name, [L.Var("jump"), L.Var(instr.thenLabel)]),
      ]
    }

    case "Goto": {
      return [L.Line("ins", name, [L.Var("jump"), L.Var(instr.label)])]
    }

    case "Return": {
      return onTailExp(name, instr.exp)
    }
  }
}

function onExp(name: string, exp: B.Exp): Array<L.Line> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [L.Line("ins", name, [L.Var("literal"), exp])]
    }

    case "Var": {
      return onVar(name, exp)
    }

    case "Apply": {
      return onApply(name, exp)
    }
  }
}

function onTailExp(name: string, exp: B.Exp): Array<L.Line> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [L.Line("ins", name, [L.Var("literal"), exp]),
              L.Line("ins", name, [L.Var("return")]), ]
    }

    case "Var": {
      return [...onVar(name, exp), L.Line("ins", name, [L.Var("return")])]
    }

    case "Apply": {
      return onTailApply(name, exp)
    }
  }
}

function onVar(name: string, exp: B.Exp): Array<L.Line> {
  return []
}

function onApply(name: string, exp: B.Exp): Array<L.Line> {
  return []
}

function onTailApply(name: string, exp: B.Exp): Array<L.Line> {
  return []
}
