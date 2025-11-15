import * as S from "@xieyuheng/x-sexp.js"
import * as B from "../../basic/index.ts"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"
import type { Definition } from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modOwnDefinitions, type Mod } from "../mod/index.ts"
import * as Stmts from "../stmt/index.ts"

export function ExplicateControlPass(mod: Mod, basicMod: B.Mod): void {
  for (const stmt of mod.stmts) {
    if (Stmts.isAboutModule(stmt)) {
      basicMod.stmts.push(stmt)
    }
  }

  for (const definition of modOwnDefinitions(mod)) {
    onDefinition(basicMod, definition)
  }
}

type State = {
  fn: B.FunctionDefinition
}

function onDefinition(basicMod: B.Mod, definition: Definition): null {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const fn = B.FunctionDefinition(
        basicMod,
        definition.name,
        new Map(),
        definition.meta,
      )
      basicMod.definitions.set(fn.name, fn)
      const initialInstrs = Array.from(
        definition.parameters
          .entries()
          .map(([index, name]) => B.Argument(index, name)),
      )

      const state = { fn }
      const block = B.Block("entry", initialInstrs)
      state.fn.blocks.set(block.label, block)
      block.instrs.push(...inTail(state, definition.body))
      B.checkBlockTerminator(block)
      return null
    }
  }
}

function generateLabel(
  state: State,
  name: string,
  instrs: Array<B.Instr>,
): string {
  const subscript = stringToSubscript(state.fn.blocks.size.toString())
  const label = `${state.fn.name}/${name}${subscript}`
  const block = B.Block(label, instrs)
  B.checkBlockTerminator(block)
  state.fn.blocks.set(block.label, block)
  return label
}

function expToValue(exp: Exp): B.Value {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "FunctionRef": {
      return exp
    }

    default: {
      let message = `[expToValue] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function inTail(state: State, exp: Exp): Array<B.Instr> {
  switch (exp.kind) {
    case "Var": {
      return [B.Return(exp.name)]
    }

    case "Apply": {
      const name = "_↩"
      return [
        B.Apply(Exps.varName(exp.target), Exps.varName(exp.arg), name),
        B.Return(name),
      ]
    }

    case "NullaryApply": {
      const name = "_↩"
      return [B.NullaryApply(Exps.varName(exp.target), name), B.Return(name)]
    }

    case "Let1": {
      return inLet1(state, exp.name, exp.rhs, inTail(state, exp.body))
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
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
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

    case "Var": {
      return [B.Call("identity", [rhs.name], name), ...cont]
    }

    case "Apply": {
      return [
        B.Apply(Exps.varName(rhs.target), Exps.varName(rhs.arg), name),
        ...cont,
      ]
    }

    case "NullaryApply": {
      return [B.NullaryApply(Exps.varName(rhs.target), name), ...cont]
    }

    case "Let1": {
      return inLet1(
        state,
        rhs.name,
        rhs.rhs,
        inLet1(state, name, rhs.body, cont),
      )
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
      if (rhs.meta) throw new S.ErrorWithMeta(message, rhs.meta)
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
  if (Exps.isBool(condition)) {
    return Exps.isTrue(condition) ? thenCont : elseCont
  }

  switch (condition.kind) {
    case "Var": {
      return [
        B.Branch(
          condition.name,
          generateLabel(state, "then", thenCont),
          generateLabel(state, "else", elseCont),
        ),
      ]
    }

    case "Let1": {
      return inLet1(
        state,
        condition.name,
        condition.rhs,
        inIf(state, condition.body, thenCont, elseCont),
      )
    }

    case "If": {
      thenCont = [B.Goto(generateLabel(state, "then", thenCont))]
      elseCont = [B.Goto(generateLabel(state, "else", elseCont))]
      return inIf(
        state,
        condition.condition,
        inIf(state, condition.consequent, thenCont, elseCont),
        inIf(state, condition.alternative, thenCont, elseCont),
      )
    }

    default: {
      let message = `[inIf] unhandled condition exp`
      message += `\n  exp: ${formatExp(condition)}`
      if (condition.meta) throw new S.ErrorWithMeta(message, condition.meta)
      else throw new Error(message)
    }
  }
}
