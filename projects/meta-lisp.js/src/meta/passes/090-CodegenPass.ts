import * as B from "../../basic/index.ts"
import * as L from "../../li/index.ts"

export function CodegenPass(basicMod: B.Mod, liMod: L.Mod): void {
  for (const definition of basicMod.definitions.values()) {
    if (definition.kind === "VariableDefinition") {
      liMod.lines.push(
        L.Line("put", `${definition.name}/is-variable`, [L.Keyword("true")]),
      )
    }
  }

  for (const definition of basicMod.definitions.values()) {
    liMod.lines.push(...onDefinition(basicMod, definition))
  }
}

function onDefinition(mod: B.Mod, definition: B.Definition): Array<L.Line> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return []
    }

    case "FunctionDefinition": {
      const blocks = definition.blocks.values()
      return [
        L.Line("put", `${definition.name}/arity`, [
          L.Int(BigInt(definition.parameters.length)),
        ]),
        ...definition.parameters
          .toReversed()
          .map((parameter) =>
            L.Line("ins", definition.name, [
              L.Keyword("local-store"),
              L.Keyword(parameter),
            ]),
          ),
        ...blocks.flatMap((block) => onBlock(mod, definition.name, block)),
      ]
    }

    case "VariableDefinition": {
      const blocks = definition.blocks.values()
      return [
        ...blocks.flatMap((block) => onBlock(mod, definition.name, block)),
      ]
    }
  }
}

function onBlock(mod: B.Mod, name: string, block: B.Block): Array<L.Line> {
  return [
    L.Line("ins", name, [L.Keyword("label"), L.Keyword(block.label)]),
    ...block.instrs.flatMap((instr) => onInstr(mod, name, instr)),
  ]
}

function onInstr(mod: B.Mod, name: string, instr: B.Instr): Array<L.Line> {
  switch (instr.kind) {
    case "Assign": {
      return [
        ...onExp(mod, name, instr.exp),
        L.Line("ins", name, [L.Keyword("local-store"), L.Keyword(instr.dest)]),
      ]
    }

    case "Perform": {
      return [
        ...onExp(mod, name, instr.exp),
        L.Line("ins", name, [L.Keyword("drop")]),
      ]
    }

    case "Test": {
      return onExp(mod, name, instr.exp)
    }

    case "Branch": {
      return [
        L.Line("ins", name, [
          L.Keyword("jump-if-not"),
          L.Keyword(instr.elseLabel),
        ]),
        L.Line("ins", name, [L.Keyword("jump"), L.Keyword(instr.thenLabel)]),
      ]
    }

    case "Goto": {
      return [L.Line("ins", name, [L.Keyword("jump"), L.Keyword(instr.label)])]
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
      return [L.Line("ins", name, [L.Keyword("literal"), exp])]
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
        L.Line("ins", name, [L.Keyword("literal"), exp]),
        L.Line("ins", name, [L.Keyword("return")]),
      ]
    }

    case "Var": {
      return [
        ...onVar(mod, name, exp),
        L.Line("ins", name, [L.Keyword("return")]),
      ]
    }

    case "Apply": {
      return onTailApply(mod, name, exp)
    }
  }
}

function onVar(mod: B.Mod, name: string, exp: B.Var): Array<L.Line> {
  const definition = B.modLookupDefinition(mod, exp.name)
  if (definition === undefined) {
    return [L.Line("ins", name, [L.Keyword("local-load"), L.Keyword(exp.name)])]
  }

  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      return [L.Line("ins", name, [L.Keyword("ref"), L.Keyword(exp.name)])]
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        L.Line("ins", name, [L.Keyword("global-load"), L.Keyword(exp.name)]),
      ]
    }
  }
}

function onApply(mod: B.Mod, name: string, exp: B.Apply): Array<L.Line> {
  return onGeneralApply(mod, name, exp, false)
}

function onTailApply(mod: B.Mod, name: string, exp: B.Apply): Array<L.Line> {
  return onGeneralApply(mod, name, exp, true)
}

function onGeneralApply(
  mod: B.Mod,
  name: string,
  exp: B.Apply,
  isTail: boolean,
): Array<L.Line> {
  const applyMode = isTail ? "tail-apply" : "apply"
  const callMode = isTail ? "tail-call" : "call"
  const definition = B.modLookupDefinition(mod, B.asVar(exp.target).name)
  if (definition === undefined) {
    return [
      ...exp.args.flatMap((arg) => onExp(mod, name, arg)),
      L.Line("ins", name, [
        L.Keyword("local-load"),
        L.Keyword(B.asVar(exp.target).name),
      ]),
      L.Line("ins", name, [
        L.Keyword(applyMode),
        L.Int(BigInt(exp.args.length)),
      ]),
    ]
  }

  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      const arity = B.definitionArity(definition)
      if (exp.args.length < arity) {
        return [
          ...exp.args.flatMap((arg) => onExp(mod, name, arg)),
          L.Line("ins", name, [
            L.Keyword("ref"),
            L.Keyword(B.asVar(exp.target).name),
          ]),
          L.Line("ins", name, [
            L.Keyword(applyMode),
            L.Int(BigInt(exp.args.length)),
          ]),
        ]
      } else if (exp.args.length === arity) {
        return [
          ...exp.args.flatMap((arg) => onExp(mod, name, arg)),
          L.Line("ins", name, [
            L.Keyword(callMode),
            L.Keyword(B.asVar(exp.target).name),
          ]),
        ]
      } else {
        return [
          ...exp.args.slice(0, arity).flatMap((arg) => onExp(mod, name, arg)),
          L.Line("ins", name, [
            L.Keyword("call"),
            L.Keyword(B.asVar(exp.target).name),
          ]),
          ...exp.args.slice(arity).flatMap((arg) => onExp(mod, name, arg)),
          L.Line("ins", name, [
            L.Keyword(applyMode),
            L.Int(BigInt(exp.args.length - arity)),
          ]),
        ]
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        ...exp.args.flatMap((arg) => onExp(mod, name, arg)),
        L.Line("ins", name, [
          L.Keyword("global-load"),
          L.Keyword(B.asVar(exp.target).name),
        ]),
        L.Line("ins", name, [
          L.Keyword(applyMode),
          L.Int(BigInt(exp.args.length)),
        ]),
      ]
    }
  }
}
