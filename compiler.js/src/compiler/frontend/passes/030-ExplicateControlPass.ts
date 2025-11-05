import * as X from "@xieyuheng/x-sexp.js"
import { stringToSubscript } from "../../../helpers/string/stringToSubscript.ts"
import * as B from "../../backend/index.ts"
import type { Definition } from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"

export function ExplicateControlPass(mod: Mod): B.Mod {
  const backendMod = B.createMod(mod.url)
  for (const definition of mod.definitions.values()) {
    if (definition.kind === "FunctionDefinition") {
      onDefinition(backendMod, definition)
    }
  }

  return backendMod
}

type State = {
  fn: B.FunctionDefinition
}

function onDefinition(backendMod: B.Mod, definition: Definition): void {
  const fn = B.FunctionDefinition(definition.name, new Map())
  backendMod.definitions.set(definition.name, fn)
  const state = { fn }
  const instrs = inTail(state, definition.body)
  const block = B.Block("entry", instrs)
  addBlock(state, block)
}

function addBlock(state: State, block: B.Block): void {
  // B.checkBlockTerminator(block)
  state.fn.blocks.set(block.label, block)
}

function generateLabel(
  state: State,
  name: string,
  instrs: Array<B.Instr>,
): string {
  const subscript = stringToSubscript(state.fn.blocks.size.toString())
  const label = `${state.fn.name}/${name}${subscript}`
  const block = B.Block(label, instrs)
  addBlock(state, block)
  return label
}

function expToValue(exp: Exp): B.Value {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "FunctionRef": {
      return exp
    }

    default: {
      let message = `[expToValue] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function inTail(state: State, exp: Exp): Array<B.Instr> {
  switch (exp.kind) {
    case "Var": {
      return [B.Return([exp.name])]
    }

    case "Let1": {
      return inLet1(state, exp.name, exp.rhs, inTail(state, exp.body))
    }

    case "Begin": {
      return inBegin(state, exp.head, inTail(state, exp.body))
    }

    case "If": {
      return inIf(
        state,
        exp.condition,
        inTail(state, exp.consequent),
        inTail(state, exp.alternative),
      )
    }

    default: {
      let message = `[inTail] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function inLet1(
  state: State,
  name: string,
  rhs: Exp,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (rhs.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "FunctionRef": {
      return [B.Const(expToValue(rhs), name), ...cont]
    }

    // case "Var": {
    //   return [B.Identity(rhs.name, name), ...cont]
    // }

    case "Apply": {
      return [
        B.Apply(
          [Exps.varName(rhs.target), ...rhs.args.map((e) => Exps.varName(e))],
          name,
        ),
        ...cont,
      ]
    }

    case "Let1": {
      return inLet1(
        state,
        rhs.name,
        rhs.rhs,
        inLet1(state, name, rhs.body, cont),
      )
    }

    case "Begin": {
      return inBegin(state, rhs.head, inLet1(state, name, rhs.body, cont))
    }

    case "If": {
      const letBodyLabel = generateLabel(state, "let-body", cont)
      return inIf(
        state,
        rhs.condition,
        inLet1(state, name, rhs.consequent, [B.Goto(letBodyLabel)]),
        inLet1(state, name, rhs.alternative, [B.Goto(letBodyLabel)]),
      )
    }

    default: {
      let message = `[inLet1] unhandled rhs exp`
      message += `\n  exp: ${formatExp(rhs)}`
      if (rhs.meta) throw new X.ErrorWithMeta(message, rhs.meta)
      else throw new Error(message)
    }
  }
}

function inIf(
  state: State,
  condition: Exp,
  thenCont: Array<B.Instr>,
  elseCont: Array<B.Instr>,
): Array<B.Instr> {
  switch (condition.kind) {
    default: {
      let message = `[inIf] unhandled condition exp`
      message += `\n  exp: ${formatExp(condition)}`
      if (condition.meta) throw new X.ErrorWithMeta(message, condition.meta)
      else throw new Error(message)
    }
  }
}

function inBegin(
  state: State,
  head: Exp,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  throw new Error()
}
