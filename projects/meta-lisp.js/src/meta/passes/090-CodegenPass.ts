import * as B from "../../basic/index.ts"
import * as L from "../../linn/index.ts"

export function CodegenPass(basicMod: B.Mod, linnMod: L.Mod): void {
  for (const stmt of basicMod.stmts) {
    linnMod.lines.push(...onStmt(basicMod, stmt))
  }
}

function onStmt(mod: B.Mod, stmt: B.Stmt): Array<L.Line> {
  switch (stmt.kind) {
    case "DefineFunction": {
      // TODO parameters
      // TODO arity
      const blocks = stmt.blocks.values()
      return Array.from(
        blocks.flatMap((block) => onBlock(mod, stmt.name, block)),
      )
    }

    case "DefineVariable": {
      // TODO is variable
      const blocks = stmt.blocks.values()
      return Array.from(
        blocks.flatMap((block) => onBlock(mod, stmt.name, block)),
      )
    }
  }
}

function onBlock(mod: B.Mod, name: string, block: B.Block): Array<L.Line> {
  return block.instrs.flatMap((instr) => onInstr(mod, name, instr))
}

function onInstr(mod: B.Mod, name: string, instr: B.Instr): Array<L.Line> {
  switch (instr.kind) {
    case "Assign": {
      return [
        ...onExp(mod, name, instr.exp),
        L.Line("ins", name, [L.Var("local-store"), L.Var(instr.dest)]),
      ]
    }

    case "Perform": {
      return [
        ...onExp(mod, name, instr.exp),
        L.Line("ins", name, [L.Var("drop")]),
      ]
    }

    case "Test": {
      return onExp(mod, name, instr.exp)
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
      return onTailExp(mod, name, instr.exp)
    }
  }
}

function onExp(mod: B.Mod, name: string, exp: B.Exp): Array<L.Line> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [L.Line("ins", name, [L.Var("literal"), exp])]
    }

    case "Var": {
      return onVar(mod, name, exp)
    }

    case "Apply": {
      return onApply(mod, name, exp)
    }
  }
}

function onTailExp(mod: B.Mod, name: string, exp: B.Exp): Array<L.Line> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [
        L.Line("ins", name, [L.Var("literal"), exp]),
        L.Line("ins", name, [L.Var("return")]),
      ]
    }

    case "Var": {
      return [...onVar(mod, name, exp), L.Line("ins", name, [L.Var("return")])]
    }

    case "Apply": {
      return onTailApply(mod, name, exp)
    }
  }
}

function onVar(mod: B.Mod, name: string, exp: B.Exp): Array<L.Line> {
  return []
}

function onApply(mod: B.Mod, name: string, exp: B.Exp): Array<L.Line> {
  return []
}

function onTailApply(mod: B.Mod, name: string, exp: B.Exp): Array<L.Line> {
  return []
}
