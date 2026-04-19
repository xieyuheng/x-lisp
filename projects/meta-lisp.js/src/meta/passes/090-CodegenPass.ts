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

function onVar(mod: B.Mod, name: string, exp: B.Var): Array<L.Line> {
  const stmt = B.modLookupStmt(mod, exp.name)
  if (stmt) {
    switch (stmt.kind) {
      case "DefineFunction": {
        return [L.Line("ins", name, [L.Var("ref"), L.Var(exp.name)])]
      }

      case "DefineVariable": {
        return [L.Line("ins", name, [L.Var("global-load"), L.Var(exp.name)])]
      }
    }
  }

  return [L.Line("ins", name, [L.Var("local-load"), L.Var(exp.name)])]
}

function onApply(mod: B.Mod, name: string, exp: B.Apply): Array<L.Line> {
  return onGeneralApply(mod, name, exp, "apply")
}

function onTailApply(mod: B.Mod, name: string, exp: B.Apply): Array<L.Line> {
  return onGeneralApply(mod, name, exp, "tail-apply")
}

function onGeneralApply(
  mod: B.Mod,
  name: string,
  exp: B.Apply,
  applyMode: string,
): Array<L.Line> {
  const stmt = B.modLookupStmt(mod, B.asVar(exp.target).name)
  if (stmt) {
    switch (stmt.kind) {
      case "DefineFunction": {
        const arity = stmt.parameters.length
        if (exp.args.length < arity) {
          return [
            ...exp.args.flatMap((arg) => onExp(mod, name, arg)),
            L.Line("ins", name, [
              L.Var("ref"),
              L.Var(B.asVar(exp.target).name),
            ]),
            L.Line("ins", name, [
              L.Var("literal"),
              L.Int(BigInt(exp.args.length)),
            ]),
            L.Line("ins", name, [L.Var(applyMode)]),
          ]
        } else if (exp.args.length === arity) {
          return [
            ...exp.args.flatMap((arg) => onExp(mod, name, arg)),
            L.Line("ins", name, [
              L.Var("call"),
              L.Var(B.asVar(exp.target).name),
            ]),
          ]
        } else
          [
            ...exp.args.slice(0, arity).flatMap((arg) => onExp(mod, name, arg)),
            L.Line("ins", name, [
              L.Var("call"),
              L.Var(B.asVar(exp.target).name),
            ]),
            ...exp.args.slice(arity).flatMap((arg) => onExp(mod, name, arg)),
            L.Line("ins", name, [
              L.Var("literal"),
              L.Int(BigInt(exp.args.length - arity)),
            ]),
            L.Line("ins", name, [L.Var(applyMode)]),
          ]
      }

      case "DefineVariable": {
        return [
          ...exp.args.flatMap((arg) => onExp(mod, name, arg)),
          L.Line("ins", name, [
            L.Var("global-load"),
            L.Var(B.asVar(exp.target).name),
          ]),
          L.Line("ins", name, [
            L.Var("literal"),
            L.Int(BigInt(exp.args.length)),
          ]),
          L.Line("ins", name, [L.Var(applyMode)]),
        ]
      }
    }
  }

  return [
    ...exp.args.flatMap((arg) => onExp(mod, name, arg)),
    L.Line("ins", name, [L.Var("local-load"), L.Var(B.asVar(exp.target).name)]),
    L.Line("ins", name, [L.Var("literal"), L.Int(BigInt(exp.args.length))]),
    L.Line("ins", name, [L.Var(applyMode)]),
  ]
}
