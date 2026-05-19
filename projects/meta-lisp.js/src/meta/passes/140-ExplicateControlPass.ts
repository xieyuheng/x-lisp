import * as S from "@xieyuheng/sexp.js"
import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../index.ts"

export function ExplicateControlPass(project: M.Project): B.Mod {
  const basicMod = B.createMod()

  for (const mod of project.mods.values()) {
    if (!mod.isErrorModule) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of explicateControlDefinition(
          basicMod,
          definition,
        )) {
          basicMod.definitions.set(basicDefinition.name, basicDefinition)
        }
      }
    }
  }

  return basicMod
}

function definitionQualifiedName(definition: M.Definition): string {
  return `${definition.mod.name}/${definition.name}`
}

function explicateControlDefinition(
  basicMod: B.Mod,
  definition: M.Definition,
): Array<B.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveFunctionDefinition": {
      return [
        B.PrimitiveFunctionDeclaration(
          basicMod,
          definitionQualifiedName(definition),
          definition.arity,
          definition.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration":
    case "PrimitiveVariableDefinition": {
      return [
        B.PrimitiveVariableDeclaration(
          basicMod,
          definitionQualifiedName(definition),
          definition.location,
        ),
      ]
    }

    // - do not generate code for type.
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition":
    case "TypeDefinition": {
      return []
    }

    case "FunctionDefinition": {
      const state = createState()
      const block = B.Block("body", [], definition.location)
      addBlock(state, block)
      block.instrs = explicateControlInTail(state, definition.body)
      return [
        B.FunctionDefinition(
          basicMod,
          definitionQualifiedName(definition),
          definition.parameters,
          state.blocks,
          definition.location,
        ),
      ]
    }

    case "TestDefinition": {
      const state = createState()
      const block = B.Block("body", [], definition.location)
      addBlock(state, block)
      block.instrs = explicateControlInTail(state, definition.body)
      return [
        B.TestDefinition(
          basicMod,
          definitionQualifiedName(definition),
          state.blocks,
          definition.location,
        ),
      ]
    }

    case "VariableDefinition": {
      const state = createState()
      const block = B.Block("body", [], definition.location)
      addBlock(state, block)
      block.instrs = explicateControlInTail(state, definition.body)
      return [
        B.VariableDefinition(
          basicMod,
          definitionQualifiedName(definition),
          state.blocks,
          definition.location,
        ),
      ]
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
  location: SourceLocation,
): string {
  const label = `${name}.${state.blocks.size}`
  const block = B.Block(label, instrs, location)
  addBlock(state, block)
  return label
}

function toBasicExp(exp: M.Exp): B.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Var": {
      return exp
    }

    case "QualifiedVar": {
      return B.Var(`${exp.modName}/${exp.name}`, exp.location)
    }

    case "Apply": {
      return B.Apply(
        toBasicExp(exp.target),
        exp.args.map(toBasicExp),
        exp.location,
      )
    }

    default: {
      let message = `[ExplicateControlPass] [toBasicExp] unhandled exp`
      message += `\n  exp kind: ${exp.kind}`
      message += `\n  exp: ${M.formatExp(exp)}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }
  }
}

function explicateControlInTail(state: State, exp: M.Exp): Array<B.Instr> {
  switch (exp.kind) {
    case "Let1": {
      return explicateControlInLet1(
        state,
        exp.name,
        exp.rhs,
        explicateControlInTail(state, exp.body),
      )
    }

    case "Begin1": {
      return explicateControlInBegin1(
        state,
        exp.head,
        explicateControlInTail(state, exp.body),
      )
    }

    case "If": {
      return explicateControlInIf(
        state,
        exp.condition,
        explicateControlInTail(state, exp.consequent),
        explicateControlInTail(state, exp.alternative),
      )
    }

    default: {
      return [B.Return(toBasicExp(exp), exp.location)]
    }
  }
}

function explicateControlInLet1(
  state: State,
  name: string,
  rhs: M.Exp,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (rhs.kind) {
    case "Let1": {
      return explicateControlInLet1(
        state,
        rhs.name,
        rhs.rhs,
        explicateControlInLet1(state, name, rhs.body, cont),
      )
    }

    case "Begin1": {
      return explicateControlInBegin1(
        state,
        rhs.head,
        explicateControlInLet1(state, name, rhs.body, cont),
      )
    }

    case "If": {
      const letBodyLabel = generateLabel(state, "let-body", cont, rhs.location)
      return explicateControlInIf(
        state,
        rhs.condition,
        explicateControlInLet1(state, name, rhs.consequent, [
          B.Goto(letBodyLabel, rhs.location),
        ]),
        explicateControlInLet1(state, name, rhs.alternative, [
          B.Goto(letBodyLabel, rhs.location),
        ]),
      )
    }

    default: {
      return [B.Assign(name, toBasicExp(rhs), rhs.location), ...cont]
    }
  }
}

function explicateControlInBegin1(
  state: State,
  head: M.Exp,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (head.kind) {
    case "Let1": {
      return explicateControlInLet1(
        state,
        head.name,
        head.rhs,
        explicateControlInBegin1(state, head.body, cont),
      )
    }

    case "Begin1": {
      return explicateControlInBegin1(
        state,
        head.head,
        explicateControlInBegin1(state, head.body, cont),
      )
    }

    case "If": {
      const letBodyLabel = generateLabel(state, "let-body", cont, head.location)
      return explicateControlInIf(
        state,
        head.condition,
        explicateControlInBegin1(state, head.consequent, [
          B.Goto(letBodyLabel, head.location),
        ]),
        explicateControlInBegin1(state, head.alternative, [
          B.Goto(letBodyLabel, head.location),
        ]),
      )
    }

    default: {
      return [B.Perform(toBasicExp(head), head.location), ...cont]
    }
  }
}

function explicateControlInIf(
  state: State,
  condition: M.Exp,
  thenCont: Array<B.Instr>,
  elseCont: Array<B.Instr>,
): Array<B.Instr> {
  if (
    condition.kind === "QualifiedVar" &&
    condition.modName === "builtin" &&
    condition.name === "true"
  ) {
    return thenCont
  }

  if (
    condition.kind === "QualifiedVar" &&
    condition.modName === "builtin" &&
    condition.name === "false"
  ) {
    return elseCont
  }

  switch (condition.kind) {
    case "Var": {
      return [
        B.Test(
          B.Apply(
            B.Var("builtin/equal?", condition.location),
            [
              B.Var(condition.name, condition.location),
              B.Keyword("t", condition.location),
            ],
            condition.location,
          ),
          condition.location,
        ),
        B.Branch(
          generateLabel(state, "then", thenCont, condition.location),
          generateLabel(state, "else", elseCont, condition.location),
          condition.location,
        ),
      ]
    }

    case "Apply": {
      if (
        condition.target.kind === "Var" &&
        condition.target.name === "not" &&
        condition.args.length === 1
      ) {
        const [negatedCondition] = condition.args
        return explicateControlInIf(state, negatedCondition, elseCont, thenCont)
      }

      return [
        B.Test(toBasicExp(condition), condition.location),
        B.Branch(
          generateLabel(state, "then", thenCont, condition.location),
          generateLabel(state, "else", elseCont, condition.location),
          condition.location,
        ),
      ]
    }

    case "Let1": {
      return explicateControlInLet1(
        state,
        condition.name,
        condition.rhs,
        explicateControlInIf(state, condition.body, thenCont, elseCont),
      )
    }

    case "Begin1": {
      return explicateControlInBegin1(
        state,
        condition.head,
        explicateControlInIf(state, condition.body, thenCont, elseCont),
      )
    }

    case "If": {
      thenCont = [
        B.Goto(
          generateLabel(state, "then", thenCont, condition.location),
          condition.location,
        ),
      ]
      elseCont = [
        B.Goto(
          generateLabel(state, "else", elseCont, condition.location),
          condition.location,
        ),
      ]
      return explicateControlInIf(
        state,
        condition.condition,
        explicateControlInIf(state, condition.consequent, thenCont, elseCont),
        explicateControlInIf(state, condition.alternative, thenCont, elseCont),
      )
    }

    default: {
      let message = `[ExplicateControlPass] [explicateControlInIf] unhandled condition exp`
      message += `\n  exp: ${M.formatExp(condition)}`
      if (condition.location)
        throw new S.ErrorWithSourceLocation(message, condition.location)
      else throw new Error(message)
    }
  }
}
