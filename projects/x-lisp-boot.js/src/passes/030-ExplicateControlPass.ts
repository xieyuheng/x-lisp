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
  return [
    // (define-function <name> ...)
    explicateFunctionDefinition(basicMod, definition),

    // (define-variable _<name>/constant)
    B.VariableDefinition(
      basicMod,
      `_${definition.name}/constant`,
      B.Undefined(),
      definition.meta,
    ),

    // (define-setup _<name>/setup
    //   (block body
    //     (= function-address (literal (@address <name>)))
    //     (= arity (literal <arity>))
    //     (= size (literal 0))
    //     (= curry (call (@primitive-function make-curry 3)
    //                function-address arity size))
    //     (store _<name>/constant curry)
    //     (return)))
    B.SetupDefinition(
      basicMod,
      `_${definition.name}/setup`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Literal("function-address", B.Address(definition.name)),
            B.Literal("arity", B.Int(definition.parameters.length)),
            B.Literal("size", B.Int(0)),
            B.Call(
              "curry",
              B.Function("make-curry", 3, { isPrimitive: true }),
              ["function-address", "arity", "size"],
            ),
            B.Store(`_${definition.name}/constant`, "curry"),
            B.Return(),
          ]),
        ],
      ]),
      definition.meta,
    ),
  ]
}

function explicateFunctionDefinition(
  basicMod: B.Mod,
  definition: X.FunctionDefinition,
): B.Definition {
  const fn = B.FunctionDefinition(
    basicMod,
    definition.name,
    new Map(),
    definition.meta,
  )

  const state = { fn }
  const initialInstrs = Array.from(
    definition.parameters
      .entries()
      .map(([index, name]) => B.Argument(name, index)),
  )
  const block = B.Block("body", initialInstrs)
  state.fn.blocks.set(block.label, block)
  block.instrs.push(...inTail(state, definition.body))
  B.checkBlockTerminator(block)
  return fn
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

    // (define-variable _<name>/flag)
    B.VariableDefinition(
      basicMod,
      `_${definition.name}/flag`,
      B.Undefined(),
      definition.meta,
    ),

    // (define-setup _<name>/flag-setup)
    B.SetupDefinition(
      basicMod,
      `_${definition.name}/flag-setup`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Literal("false", B.Bool(false)),
            B.Store(`_${definition.name}/flag`, "false"),
            B.Return(),
          ]),
        ],
      ]),
      definition.meta,
    ),

    // (define-function _<name>/get
    //   (block body
    //     (= flag (load _<name>/flag))
    //     (branch flag cached init))
    //   (block cached
    //     (= result (load <name>))
    //     (return result))
    //   (block init
    //     (= result (call _<name>/init-function))
    //     (store <name> result)
    //     (= true (const #t))
    //     (store _<name>/flag true)
    //     (return result)))
    B.FunctionDefinition(
      basicMod,
      `_${definition.name}/get`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Load("flag", `_${definition.name}/flag`),
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
              B.Function(`_${definition.name}/init-function`, 0, {
                isPrimitive: false,
              }),
              [],
            ),
            B.Store(definition.name, "result"),
            B.Literal("true", B.Bool(true)),
            B.Store(`_${definition.name}/flag`, "true"),
            B.Return("result"),
          ]),
        ],
      ]),
      definition.meta,
    ),

    // (define-function _<name>/init-function
    //   (block body
    //     (compile <body>)))
    explicateFunctionDefinition(
      basicMod,
      X.FunctionDefinition(
        definition.mod,
        `_${definition.name}/init-function`,
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
      return [B.Literal(name, expToValue(exp)), B.Return(name)]
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
      return [B.Literal(name, expToValue(rhs)), ...cont]
    }

    case "Constant": {
      const getter = B.Function(`_${rhs.name}/get`, 0, { isPrimitive: false })
      return [B.Call(name, getter, []), ...cont]
    }

    case "Var": {
      return [B.Identity(name, rhs.name), ...cont]
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
