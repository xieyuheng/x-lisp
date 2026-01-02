import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import * as B from "../basic/index.ts"
import * as L from "../index.ts"

export function ExplicateControlPass(mod: L.Mod, basicMod: B.Mod): void {
  for (const stmt of mod.stmts) {
    if (L.isAboutModule(stmt)) {
      basicMod.stmts.push(stmt)
    }
  }

  for (const definition of L.modOwnDefinitions(mod)) {
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
  definition: L.Definition,
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
  definition: L.FunctionDefinition,
): Array<B.Definition> {
  return [
    // (define-function <name> ...)
    explicateFunctionDefinition(basicMod, definition),

    // (define-metadata <name>©metadata
    //   :name "<name>"
    //   :arity <arity>
    //   :is-primitive 0
    //   :variable-info <name>©variable-info
    //   :start <address>
    //   :end <address>)
    B.MetadataDefinition(
      basicMod,
      `${definition.name}©metadata`,
      {
        name: B.StringMetadata(definition.name),
        arity: B.IntMetadata(BigInt(definition.parameters.length)),
        "is-primitive": B.IntMetadata(0n),
        "variable-info": B.PointerMetadata(`${definition.name}©variable-info`),
        start: B.PointerMetadata(`${definition.name}`),
        end: B.PointerMetadata(`${definition.name}/end`),
      },
      definition.meta,
    ),

    // (define-placeholder <name>©variable-info)
    B.PlaceholderDefinition(
      basicMod,
      `${definition.name}©variable-info`,
      definition.meta,
    ),

    // (define-placeholder <name>/end)
    B.PlaceholderDefinition(
      basicMod,
      `${definition.name}/end`,
      definition.meta,
    ),

    // (define-variable <name>©constant)
    B.VariableDefinition(
      basicMod,
      `${definition.name}©constant`,
      B.Undefined(),
      definition.meta,
    ),

    // (define-setup <name>©setup
    //   (block body
    //     (= address (literal (@address <name>)))
    //     (= metadata (literal (@address <name>©metadata)))
    //     (= function (call (@primitive-function make-function 2) address metadata))
    //     (store <name>©constant function)
    //     (return)))
    B.SetupDefinition(
      basicMod,
      `${definition.name}©setup`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Literal(
              "address",
              B.Address(definition.name, { isPrimitive: false }),
            ),
            B.Literal(
              "metadata",
              B.Address(`${definition.name}©metadata`, { isPrimitive: false }),
            ),
            B.Call(
              "function",
              B.FunctionRef("make-function", 2, { isPrimitive: true }),
              ["address", "metadata"],
            ),
            B.Store(`${definition.name}©constant`, "function"),
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
  definition: L.FunctionDefinition,
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
  definition: L.ConstantDefinition,
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

    // (define-variable <name>©flag)
    B.VariableDefinition(
      basicMod,
      `${definition.name}©flag`,
      B.Undefined(),
      definition.meta,
    ),

    // (define-setup <name>©flag-setup)
    B.SetupDefinition(
      basicMod,
      `${definition.name}©flag-setup`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Literal("false", B.Bool(false)),
            B.Store(`${definition.name}©flag`, "false"),
            B.Return(),
          ]),
        ],
      ]),
      definition.meta,
    ),

    // (define-function <name>©get
    //   (block body
    //     (= flag (load <name>©flag))
    //     (branch flag cached init))
    //   (block cached
    //     (= result (load <name>))
    //     (return result))
    //   (block init
    //     (= result (call <name>©init-function))
    //     (store <name> result)
    //     (= true (const #t))
    //     (store <name>©flag true)
    //     (return result)))
    B.FunctionDefinition(
      basicMod,
      `${definition.name}©get`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Load("flag", `${definition.name}©flag`),
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
              B.FunctionRef(`${definition.name}©init-function`, 0, {
                isPrimitive: false,
              }),
              [],
            ),
            B.Store(definition.name, "result"),
            B.Literal("true", B.Bool(true)),
            B.Store(`${definition.name}©flag`, "true"),
            B.Return("result"),
          ]),
        ],
      ]),
      definition.meta,
    ),

    // (define-function <name>©init-function
    //   (block body
    //     (compile <body>)))
    explicateFunctionDefinition(
      basicMod,
      L.FunctionDefinition(
        definition.mod,
        `${definition.name}©init-function`,
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
  const label = `${name}${subscript}`
  const block = B.Block(label, instrs)
  B.checkBlockTerminator(block)
  state.fn.blocks.set(block.label, block)
  return label
}

function expToValue(exp: L.Exp): B.Value {
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
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function inTail(state: State, exp: L.Exp): Array<B.Instr> {
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
        B.Apply(name, L.varName(exp.target), L.varName(exp.arg)),
        B.Return(name),
      ]
    }

    case "ApplyNullary": {
      const name = "_↩"
      return [B.ApplyNullary(name, L.varName(exp.target)), B.Return(name)]
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
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
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
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "FunctionRef": {
      return [B.Literal(name, expToValue(rhs)), ...cont]
    }

    case "ConstantRef": {
      const getter = B.FunctionRef(`${rhs.name}©get`, 0, { isPrimitive: false })
      return [B.Call(name, getter, []), ...cont]
    }

    case "Var": {
      return [B.Identity(name, rhs.name), ...cont]
    }

    case "Apply": {
      return [B.Apply(name, L.varName(rhs.target), L.varName(rhs.arg)), ...cont]
    }

    case "ApplyNullary": {
      return [B.ApplyNullary(name, L.varName(rhs.target)), ...cont]
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
      message += `\n  exp: ${L.formatExp(rhs)}`
      if (rhs.meta) throw new S.ErrorWithMeta(message, rhs.meta)
      else throw new Error(message)
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
      message += `\n  exp: ${L.formatExp(condition)}`
      if (condition.meta) throw new S.ErrorWithMeta(message, condition.meta)
      else throw new Error(message)
    }
  }
}
