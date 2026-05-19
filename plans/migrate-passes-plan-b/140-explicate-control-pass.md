# 140-ExplicateControlPass：迁移到 meta-lisp.meta

参考 `prompts/migrate-passes/common.md` 中的通用指导（文档、类型定义、验证命令）。

**重要**：此 pass 引入了一个新的 IR（basic IR），在 meta-lisp 中需要定义 basic IR 的类型。
如果 basic IR 类型尚未在 meta-lisp.meta 中定义，需要：
1. 在 `projects/meta-lisp.meta/src/` 下创建 `basic/` 目录，包含相应类型定义
2. 或者在本 pass 文件中直接定义所需 struct

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/140-explicate-control-pass.meta`

## JS 源码

```ts
import * as S from "@xieyuheng/sexp.js"
import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../index.ts"

export function ExplicateControlPass(project: M.Project): B.Mod {
  const basicMod = B.createMod()

  for (const mod of project.mods.values()) {
    if (!mod.isErrorModule) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of onDefinition(basicMod, definition)) {
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

function onDefinition(
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
      block.instrs = inTail(state, definition.body)
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
      block.instrs = inTail(state, definition.body)
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
      block.instrs = inTail(state, definition.body)
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

function inTail(state: State, exp: M.Exp): Array<B.Instr> {
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
      return [B.Return(toBasicExp(exp), exp.location)]
    }
  }
}

function inLet1(
  state: State,
  name: string,
  rhs: M.Exp,
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
      const letBodyLabel = generateLabel(state, "let-body", cont, rhs.location)
      return inIf(
        state,
        rhs.condition,
        inLet1(state, name, rhs.consequent, [
          B.Goto(letBodyLabel, rhs.location),
        ]),
        inLet1(state, name, rhs.alternative, [
          B.Goto(letBodyLabel, rhs.location),
        ]),
      )
    }

    default: {
      return [B.Assign(name, toBasicExp(rhs), rhs.location), ...cont]
    }
  }
}

function inBegin1(
  state: State,
  head: M.Exp,
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
      const letBodyLabel = generateLabel(state, "let-body", cont, head.location)
      return inIf(
        state,
        head.condition,
        inBegin1(state, head.consequent, [B.Goto(letBodyLabel, head.location)]),
        inBegin1(state, head.alternative, [
          B.Goto(letBodyLabel, head.location),
        ]),
      )
    }

    default: {
      return [B.Perform(toBasicExp(head), head.location), ...cont]
    }
  }
}

function inIf(
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
        return inIf(state, negatedCondition, elseCont, thenCont)
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
      return inIf(
        state,
        condition.condition,
        inIf(state, condition.consequent, thenCont, elseCont),
        inIf(state, condition.alternative, thenCont, elseCont),
      )
    }

    default: {
      let message = `[ExplicateControlPass] [inIf] unhandled condition exp`
      message += `\n  exp: ${M.formatExp(condition)}`
      if (condition.location)
        throw new S.ErrorWithSourceLocation(message, condition.location)
      else throw new Error(message)
    }
  }
}
```

## 需要定义的 Basic IR 类型

参考 `projects/meta-lisp.js/src/basic/` 中的类型。如果还未在 meta-lisp.meta 中定义，需要先创建：

```lisp
;; projects/meta-lisp.meta/src/basic/mod.meta
(define-struct basic-mod-t
  (definitions (hash-t string-t basic-definition-t)))

;; projects/meta-lisp.meta/src/basic/exp.meta
(define-enum basic-exp-t
  (symbol-exp (content symbol-t) (location source-location-t))
  (string-exp (content string-t) (location source-location-t))
  (keyword-exp (content keyword-t) (location source-location-t))
  (int-exp (content int-t) (location source-location-t))
  (float-exp (content float-t) (location source-location-t))
  (var-exp (name string-t) (location source-location-t))
  (apply-exp (target basic-exp-t) (args (list-t basic-exp-t))
             (location source-location-t)))

;; projects/meta-lisp.meta/src/basic/instr.meta
(define-enum basic-instr-t
  (assign-instr (dest string-t) (exp basic-exp-t) (location source-location-t))
  (perform-instr (exp basic-exp-t) (location source-location-t))
  (test-instr (exp basic-exp-t) (location source-location-t))
  (branch-instr (then-label string-t) (else-label string-t)
                (location source-location-t))
  (goto-instr (label string-t) (location source-location-t))
  (return-instr (exp basic-exp-t) (location source-location-t)))

;; projects/meta-lisp.meta/src/basic/block.meta
(define-struct basic-block-t
  (label string-t)
  (instrs (list-t basic-instr-t))
  (location source-location-t))

;; projects/meta-lisp.meta/src/basic/definition.meta
(define-enum basic-definition-t
  (primitive-function-declaration
    (mod basic-mod-t) (name string-t) (arity int-t)
    (location source-location-t))
  (primitive-variable-declaration
    (mod basic-mod-t) (name string-t)
    (location source-location-t))
  (function-definition
    (mod basic-mod-t) (name string-t) (parameters (list-t string-t))
    (blocks (hash-t string-t basic-block-t))
    (location source-location-t))
  (variable-definition
    (mod basic-mod-t) (name string-t)
    (blocks (hash-t string-t basic-block-t))
    (location source-location-t))
  (test-definition
    (mod basic-mod-t) (name string-t)
    (blocks (hash-t string-t basic-block-t))
    (location source-location-t)))

;; projects/meta-lisp.meta/src/basic/index.meta
(module meta)
(import-all ./mod.meta)
(import-all ./exp.meta)
(import-all ./instr.meta)
(import-all ./block.meta)
(import-all ./definition.meta)
```

也可以直接在本 pass 文件中定义所需类型。
