import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import * as B from "../basic/index.ts"
import * as L from "../lisp/index.ts"

export function ExplicateControlPass(mod: L.Mod, basicMod: B.Mod): void {
  for (const stmt of mod.stmts) {
    if (L.isAboutModule(stmt)) {
      basicMod.stmts.push(stmt)
    }
  }

  for (const definition of L.modOwnDefinitions(mod)) {
    basicMod.stmts.push(...onDefinition(basicMod, definition))
  }
}

function onDefinition(
  basicMod: B.Mod,
  definition: L.Definition,
): Array<B.Stmt> {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return []
    }

    case "FunctionDefinition": {
      const state = createState()
      const block = B.Block("body", [])
      addBlock(state, block)
      block.instrs = inTail(state, definition.body)
      return [
        B.DefineFunction(
          basicMod,
          definition.name,
          definition.parameters,
          state.blocks,
        ),
      ]
    }

    case "VariableDefinition": {
      const state = createState()
      const block = B.Block("body", [])
      addBlock(state, block)
      block.instrs = inTail(state, definition.body)
      return [B.DefineVariable(basicMod, definition.name, state.blocks)]
    }
  }
}

type State = {
  blocks: Map<string, B.Block>
}

function createState(): State {
  return { blocks: new Map() }
}

function addBlock(state: State, block: B.Block): void {
  state.blocks.set(block.label, block)
}

function generateLabel(
  state: State,
  name: string,
  instrs: Array<B.Instr>,
): string {
  const subscript = stringToSubscript(state.blocks.size.toString())
  const label = `${name}${subscript}`
  const block = B.Block(label, instrs)
  addBlock(state, block)
  return label
}

function toBasicExp(exp: L.Exp): B.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Var": {
      return exp
    }

    case "PrimitiveFunctionRef":
    case "PrimitiveVariableRef":
    case "FunctionRef":
    case "VariableRef": {
      return B.Var(exp.name)
    }

    case "Apply": {
      return B.Apply(toBasicExp(exp.target), exp.args.map(toBasicExp))
    }

    default: {
      let message = `[ExplicateControlPass] [toBasicExp] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function inTail(state: State, exp: L.Exp): Array<B.Instr> {
  switch (exp.kind) {
    case "Let1": {
      return inLet1(state, exp.name, exp.rhs, inTail(state, exp.body))
    }

    case "Begin1": {
      return inBegin1(state, exp.head, inTail(state, exp.body))
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
      return [B.Return(toBasicExp(exp))]
    }
  }
}

function inLet1(
  state: State,
  name: string,
  rhs: L.Exp,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (rhs.kind) {
    case "Let1": {
      return inLet1(
        state,
        rhs.name,
        rhs.rhs,
        inLet1(state, name, rhs.body, cont),
      )
    }

    case "Begin1": {
      return inBegin1(state, rhs.head, inLet1(state, name, rhs.body, cont))
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
      return [B.Assign(name, toBasicExp(rhs)), ...cont]
    }
  }
}

function inBegin1(
  state: State,
  head: L.Exp,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (head.kind) {
    case "Let1": {
      return inLet1(
        state,
        head.name,
        head.rhs,
        inBegin1(state, head.body, cont),
      )
    }

    case "Begin1": {
      return inBegin1(state, head.head, inBegin1(state, head.body, cont))
    }

    case "If": {
      const letBodyLabel = generateLabel(state, "let-body", cont)
      return inIf(
        state,
        head.condition,
        inBegin1(state, head.consequent, [B.Goto(letBodyLabel)]),
        inBegin1(state, head.alternative, [B.Goto(letBodyLabel)]),
      )
    }

    default: {
      return [B.Perform(toBasicExp(head)), ...cont]
    }
  }
}

function inIf(
  state: State,
  condition: L.Exp,
  thenCont: Array<B.Instr>,
  elseCont: Array<B.Instr>,
): Array<B.Instr> {
  if (L.isBool(condition)) {
    return L.isTrue(condition) ? thenCont : elseCont
  }

  switch (condition.kind) {
    case "Var": {
      return [
        B.Test(
          B.Apply(B.Var("equal?"), [B.Var(condition.name), B.Hashtag("t")]),
        ),
        B.Branch(
          generateLabel(state, "then", thenCont),
          generateLabel(state, "else", elseCont),
        ),
      ]
    }

    case "Apply": {
      if (
        condition.target.kind === "PrimitiveFunctionRef" &&
        condition.target.name === "not" &&
        condition.args.length === 1
      ) {
        const [negatedCondition] = condition.args
        return inIf(state, negatedCondition, elseCont, thenCont)
      }

      return [
        B.Test(toBasicExp(condition)),
        B.Branch(
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

    case "Begin1": {
      return inBegin1(
        state,
        condition.head,
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
      let message = `[ExplicateControlPass] [inIf] unhandled condition exp`
      message += `\n  exp: ${L.formatExp(condition)}`
      if (condition.meta) throw new S.ErrorWithMeta(message, condition.meta)
      else throw new Error(message)
    }
  }
}
