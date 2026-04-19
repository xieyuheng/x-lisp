import * as B from "../../basic/index.ts"
import * as M from "../index.ts"
import * as Linn from "../../linn/index.ts"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import { getCompileCacheDir } from "node:module"


export function CodegenPass(basicMod: B.Mod, linnMod: Linn.Mod): void {
  for (const stmt of basicMod.stmts) {
    linnMod.lines.push(...onStmt(stmt))
  }
}

function onStmt(stmt: B.Stmt): Array<Linn.Line> {
  switch (stmt.kind) {
    case "DefineFunction": {
      // TODO parameters
      // TODO arity
      const blocks = stmt.blocks.values()
      return Array.from(blocks.flatMap(block => onBlock(stmt.name, block)))
    }

    case "DefineVariable": {
      // TODO is variable
      const blocks = stmt.blocks.values()
      return Array.from(blocks.flatMap(block => onBlock(stmt.name, block)))
    }
  }
}

function onBlock(name: string, block: B.Block): Array<Linn.Line> {
  return block.instrs.flatMap(instr => onInstr(instr))
}


function onInstr(instr: B.Instr): Array<Linn.Line> {
  return []
}
