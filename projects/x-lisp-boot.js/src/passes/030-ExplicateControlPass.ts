import * as B from "@xieyuheng/basic-lisp.js"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import * as X from "../index.ts"

export function ExplicateControlPass(mod: X.Mod, basicMod: B.Mod): void {
  for (const stmt of mod.stmts) {
    if (X.isAboutModule(stmt)) {
      basicMod.stmts.push(stmt)
    }
  }

  for (const definition of X.modOwnDefinitions(mod)) {
    for (const basicDefinition of onDefinition(basicMod, definition)) {
      basicMod.definitions.set(basicDefinition.name, basicDefinition)
    }
  }
}

type State = {
  fn: B.FunctionDefinition
}

function onDefinition(
  basicMod: B.Mod,
  definition: X.Definition,
): Array<B.Definition> {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return onFunctionDefinition(basicMod, definition)
    }

    case "ConstantDefinition": {
      return onConstantDefinition(basicMod, definition)
    }
  }
}

function onFunctionDefinition(
  basicMod: B.Mod,
  definition: X.FunctionDefinition,
): Array<B.Definition> {
  const fn = B.FunctionDefinition(
    basicMod,
    definition.name,
    new Map(),
    definition.meta,
  )

  const initialInstrs = Array.from(
    definition.parameters
      .entries()
      .map(([index, name]) => B.Argument(name, index)),
  )

  const state = { fn }
  const block = B.Block("body", initialInstrs)
  state.fn.blocks.set(block.label, block)
  block.instrs.push(...inTail(state, definition.body))
  B.checkBlockTerminator(block)
  return [fn]
}

function onConstantDefinition(
  basicMod: B.Mod,
  definition: X.ConstantDefinition,
): Array<B.Definition> {
  // (define <name> <body>)

  return [
    // (define-variable <name>)
    B.VariableDefinition(
      basicMod,
      definition.name,
      B.Undefined(),
      definition.meta,
    ),

    // (define-variable ©<name>/flag false)
    B.VariableDefinition(
      basicMod,
      `©${definition.name}/flag`,
      B.Bool(false),
      definition.meta,
    ),

    // (define-function ©<name>/get
    //   (block body
    //     (= flag (load ©<name>/flag))
    //     (branch flag cached init))
    //   (block cached
    //     (= result (load <name>))
    //     (return result))
    //   (block init
    //     (= result (call ©<name>/function))
    //     (store <name> result)
    //     (= true (const #t))
    //     (store ©<name>/flag true)
    //     (return result)))
    B.FunctionDefinition(
      basicMod,
      `©${definition.name}/get`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Load("flag", `©${definition.name}/flag`),
            B.Branch("flag", "cached", "init"),
          ]),
        ],
        [
          "cached",
          B.Block("cached", [
            B.Load("result", definition.name),
            B.Return("result"),
          ]),
        ],
        [
          "init",
          B.Block("init", [
            B.Call(
              "result",
              B.Function(`©${definition.name}/function`, 0, {
                isPrimitive: false,
              }),
              [],
            ),
            B.Store(definition.name, "result"),
            B.Const("true", B.Bool(true)),
            B.Store(`©${definition.name}/flag`, "true"),
            B.Return("result"),
          ]),
        ],
      ]),
      definition.meta,
    ),

    // (define-function ©<name>/function
    //   (block body
    //     (compile <body>)))
    ...onFunctionDefinition(
      basicMod,
      X.FunctionDefinition(
        definition.mod,
        `©${definition.name}/function`,
        [],
        definition.body,
        definition.meta,
      ),
    ),
  ]
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

function expToValue(exp: X.Exp): B.Value {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "Function": {
      return exp
    }

    default: {
      let message = `[expToValue] unhandled exp`
      message += `\n  exp: ${X.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function inTail(state: State, exp: X.Exp): Array<B.Instr> {
  switch (exp.kind) {
    case "Var": {
      return [B.Return(exp.name)]
    }

    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      const name = "_↩"
      return [B.Const(name, expToValue(exp)), B.Return(name)]
    }

    case "Apply": {
      const name = "_↩"
      return [
        B.Apply(name, X.varName(exp.target), X.varName(exp.arg)),
        B.Return(name),
      ]
    }

    case "ApplyNullary": {
      const name = "_↩"
      return [B.ApplyNullary(name, X.varName(exp.target)), B.Return(name)]
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
      message += `\n  exp: ${X.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function inLet1(
  state: State,
  name: string,
  rhs: X.Exp,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (rhs.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Function": {
      return [B.Const(name, expToValue(rhs)), ...cont]
    }

    case "Constant": {
      const getter = B.Function(`©${rhs.name}/get`, 0, { isPrimitive: false })
      return [B.Call(name, getter, []), ...cont]
    }

    case "Var": {
      return [
        B.Call(name, B.Function("identity", 1, { isPrimitive: true }), [
          rhs.name,
        ]),
        ...cont,
      ]
    }

    case "Apply": {
      return [B.Apply(name, X.varName(rhs.target), X.varName(rhs.arg)), ...cont]
    }

    case "ApplyNullary": {
      return [B.ApplyNullary(name, X.varName(rhs.target)), ...cont]
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
      message += `\n  exp: ${X.formatExp(rhs)}`
      if (rhs.meta) throw new S.ErrorWithMeta(message, rhs.meta)
      else throw new Error(message)
    }
  }
}

function inIf(
  state: State,
  condition: X.Exp,
  thenCont: Array<B.Instr>,
  elseCont: Array<B.Instr>,
): Array<B.Instr> {
  if (X.isBool(condition)) {
    return X.isTrue(condition) ? thenCont : elseCont
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
      message += `\n  exp: ${X.formatExp(condition)}`
      if (condition.meta) throw new S.ErrorWithMeta(message, condition.meta)
      else throw new Error(message)
    }
  }
}
