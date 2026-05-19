# 150-CodegenPass：迁移到 meta-lisp.meta

参考 `plans/migrate-passes-plan-b/common.md` 中的通用指导（文档、类型定义、验证命令）。

**重要**：此 pass 生成 stack IR，需要 stack IR 类型定义。如果 140 中已定义了 basic IR 类型，此 pass 依赖 basic IR 和 stack IR 两种类型。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/150-codegen-pass.meta`

## JS 源码

```ts
import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../../meta/index.ts"
import * as Stk from "../../stack/index.ts"

export function CodegenPass(project: M.Project, basicMod: B.Mod): Stk.Mod {
  const stackMod = Stk.createMod()
  for (const definition of basicMod.definitions.values()) {
    for (const stackDefinition of onDefinition(basicMod, definition)) {
      stackMod.definitions.set(stackDefinition.name, stackDefinition)
    }
  }

  return stackMod
}

type State = {
  mod: B.Mod
  location: SourceLocation
  localIndexes: Map<string, number>
}

function createState(mod: B.Mod, location: SourceLocation): State {
  return {
    mod,
    location,
    localIndexes: new Map(),
  }
}

function collectLocalIndexes(state: State, definition: B.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return null
    }

    case "FunctionDefinition": {
      for (const parameter of definition.parameters) {
        addLocalIndexes(state, parameter)
      }

      for (const block of definition.blocks.values()) {
        collectLocalIndexesFromBlock(state, block)
      }

      return null
    }

    case "VariableDefinition": {
      for (const block of definition.blocks.values()) {
        collectLocalIndexesFromBlock(state, block)
      }

      return null
    }

    case "TestDefinition": {
      for (const block of definition.blocks.values()) {
        collectLocalIndexesFromBlock(state, block)
      }

      return null
    }
  }
}

function collectLocalIndexesFromBlock(state: State, block: B.Block): void {
  for (const instr of block.instrs) {
    collectLocalIndexesFromInstr(state, instr)
  }
}

function collectLocalIndexesFromInstr(state: State, instr: B.Instr): void {
  if (instr.kind === "Assign") {
    addLocalIndexes(state, instr.dest)
  }
}

function addLocalIndexes(state: State, name: string): void {
  const index = state.localIndexes.get(name)
  if (index === undefined) {
    const newIndex = state.localIndexes.size
    state.localIndexes.set(name, newIndex)
  }
}

function lookupLocalIndex(state: State, name: string): number {
  const index = state.localIndexes.get(name)
  if (index === undefined) {
    let message = `[lookupLocalIndex] undefined name: ${name}`
    throw new Error(message)
  }

  return index
}

function onDefinition(
  mod: B.Mod,
  definition: B.Definition,
): Array<Stk.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return [
        Stk.PrimitiveFunctionDeclaration(
          definition.name,
          definition.arity,
          definition.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration": {
      return [
        Stk.PrimitiveVariableDeclaration(definition.name, definition.location),
      ]
    }

    case "FunctionDefinition": {
      const state = createState(mod, definition.location)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      const instrs = [
        ...definition.parameters
          .toReversed()
          .map((parameter) =>
            Stk.Instr(
              "local-store",
              [
                Stk.Int(
                  BigInt(lookupLocalIndex(state, parameter)),
                  state.location,
                ),
                Stk.Var(parameter, state.location),
              ],
              state.location,
            ),
          ),
        ...blocks.flatMap((block) => onBlock(state, definition.name, block)),
      ]
      return [
        Stk.FunctionDefinition(
          definition.name,
          definition.parameters.length,
          instrs,
          definition.location,
        ),
      ]
    }

    case "VariableDefinition": {
      const state = createState(mod, definition.location)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) => onBlock(state, definition.name, block)),
      ]
      return [
        Stk.VariableDefinition(definition.name, instrs, definition.location),
      ]
    }

    case "TestDefinition": {
      const state = createState(mod, definition.location)
      collectLocalIndexes(state, definition)
      const blocks = definition.blocks.values()
      const instrs = [
        ...blocks.flatMap((block) => onBlock(state, definition.name, block)),
      ]
      return [Stk.TestDefinition(definition.name, instrs, definition.location)]
    }
  }
}

function onBlock(state: State, name: string, block: B.Block): Array<Stk.Instr> {
  return [
    Stk.Instr("label", [Stk.Var(block.label, state.location)], state.location),
    ...block.instrs.flatMap((instr) => onInstr(state, name, instr)),
  ]
}

function onInstr(state: State, name: string, instr: B.Instr): Array<Stk.Instr> {
  switch (instr.kind) {
    case "Assign": {
      return [
        ...onExp(state, name, instr.exp),
        Stk.Instr(
          "local-store",
          [
            Stk.Int(
              BigInt(lookupLocalIndex(state, instr.dest)),
              state.location,
            ),
            Stk.Var(instr.dest, state.location),
          ],
          state.location,
        ),
      ]
    }

    case "Perform": {
      return [
        ...onExp(state, name, instr.exp),
        Stk.Instr("drop", [], state.location),
      ]
    }

    case "Test": {
      return onExp(state, name, instr.exp)
    }

    case "Branch": {
      return [
        Stk.Instr(
          "jump-if-not",
          [Stk.Var(instr.elseLabel, state.location)],
          state.location,
        ),
        Stk.Instr(
          "jump",
          [Stk.Var(instr.thenLabel, state.location)],
          state.location,
        ),
      ]
    }

    case "Goto": {
      return [
        Stk.Instr(
          "jump",
          [Stk.Var(instr.label, state.location)],
          state.location,
        ),
      ]
    }

    case "Return": {
      return onTailExp(state, name, instr.exp)
    }
  }
}

function onExp(state: State, name: string, exp: B.Exp): Array<Stk.Instr> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [Stk.Instr("literal", [exp], state.location)]
    }

    case "Var": {
      return onVar(state, name, exp)
    }

    case "Apply": {
      return onApply(state, name, exp)
    }
  }
}

function onTailExp(state: State, name: string, exp: B.Exp): Array<Stk.Instr> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [
        Stk.Instr("literal", [exp], state.location),
        Stk.Instr("return", [], state.location),
      ]
    }

    case "Var": {
      return [
        ...onVar(state, name, exp),
        Stk.Instr("return", [], state.location),
      ]
    }

    case "Apply": {
      return onTailApply(state, name, exp)
    }
  }
}

function onVar(state: State, name: string, exp: B.Var): Array<Stk.Instr> {
  const definition = B.modLookupDefinition(state.mod, exp.name)
  if (definition === undefined) {
    return [
      Stk.Instr(
        "local-load",
        [
          Stk.Int(BigInt(lookupLocalIndex(state, exp.name)), state.location),
          Stk.Var(exp.name, state.location),
        ],
        state.location,
      ),
    ]
  }

  switch (definition.kind) {
    case "TestDefinition": {
      let message = `[CodegenPass / onVar] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      return [
        Stk.Instr("ref", [Stk.Var(exp.name, state.location)], state.location),
      ]
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        Stk.Instr(
          "global-load",
          [Stk.Var(exp.name, state.location)],
          state.location,
        ),
      ]
    }
  }
}

function onApply(state: State, name: string, exp: B.Apply): Array<Stk.Instr> {
  return onGeneralApply(state, name, exp, false)
}

function onTailApply(
  state: State,
  name: string,
  exp: B.Apply,
): Array<Stk.Instr> {
  return onGeneralApply(state, name, exp, true)
}

function onGeneralApply(
  state: State,
  name: string,
  exp: B.Apply,
  isTail: boolean,
): Array<Stk.Instr> {
  const applyMode = isTail ? "tail-apply" : "apply"
  const callMode = isTail ? "tail-call" : "call"
  const definition = B.modLookupDefinition(state.mod, B.asVar(exp.target).name)
  if (definition === undefined) {
    return [
      ...exp.args.flatMap((arg) => onExp(state, name, arg)),
      Stk.Instr(
        "local-load",
        [
          Stk.Int(
            BigInt(lookupLocalIndex(state, B.asVar(exp.target).name)),
            state.location,
          ),
          Stk.Var(B.asVar(exp.target).name, state.location),
        ],
        state.location,
      ),
      Stk.Instr(
        applyMode,
        [Stk.Int(BigInt(exp.args.length), state.location)],
        state.location,
      ),
    ]
  }

  switch (definition.kind) {
    case "TestDefinition": {
      let message = `[CodegenPass / onGeneralApply] can not handle TestDefinition`
      throw new Error(message)
    }

    case "PrimitiveFunctionDeclaration":
    case "FunctionDefinition": {
      const arity = B.definitionArity(definition)
      if (exp.args.length < arity) {
        return [
          ...exp.args.flatMap((arg) => onExp(state, name, arg)),
          Stk.Instr(
            "ref",
            [Stk.Var(B.asVar(exp.target).name, state.location)],
            state.location,
          ),
          Stk.Instr(
            applyMode,
            [Stk.Int(BigInt(exp.args.length), state.location)],
            state.location,
          ),
        ]
      } else if (exp.args.length === arity) {
        return [
          ...exp.args.flatMap((arg) => onExp(state, name, arg)),
          Stk.Instr(
            callMode,
            [Stk.Var(B.asVar(exp.target).name, state.location)],
            state.location,
          ),
        ]
      } else {
        return [
          ...exp.args.slice(0, arity).flatMap((arg) => onExp(state, name, arg)),
          Stk.Instr(
            "call",
            [Stk.Var(B.asVar(exp.target).name, state.location)],
            state.location,
          ),
          ...exp.args.slice(arity).flatMap((arg) => onExp(state, name, arg)),
          Stk.Instr(
            applyMode,
            [Stk.Int(BigInt(exp.args.length - arity), state.location)],
            state.location,
          ),
        ]
      }
    }

    case "PrimitiveVariableDeclaration":
    case "VariableDefinition": {
      return [
        ...exp.args.flatMap((arg) => onExp(state, name, arg)),
        Stk.Instr(
          "global-load",
          [Stk.Var(B.asVar(exp.target).name, state.location)],
          state.location,
        ),
        Stk.Instr(
          applyMode,
          [Stk.Int(BigInt(exp.args.length), state.location)],
          state.location,
        ),
      ]
    }
  }
}
```

## 需要定义的 Stack IR 类型

参考 `projects/meta-lisp.js/src/stack/` 中的类型。如果还未在 meta-lisp.meta 中定义，需要先创建：

```lisp
;; projects/meta-lisp.meta/src/stack/mod.meta
(define-struct stack-mod-t
  (definitions (hash-t string-t stack-definition-t)))

;; projects/meta-lisp.meta/src/stack/definition.meta
(define-enum stack-definition-t
  (primitive-function-declaration
    (name string-t) (arity int-t) (location source-location-t))
  (primitive-variable-declaration
    (name string-t) (location source-location-t))
  (function-definition
    (name string-t) (arity int-t) (instrs (list-t stack-instr-t))
    (location source-location-t))
  (variable-definition
    (name string-t) (instrs (list-t stack-instr-t))
    (location source-location-t))
  (test-definition
    (name string-t) (instrs (list-t stack-instr-t))
    (location source-location-t)))

;; projects/meta-lisp.meta/src/stack/operand.meta
(define-enum stack-operand-t
  (symbol-operand (content symbol-t) (location source-location-t))
  (string-operand (content string-t) (location source-location-t))
  (keyword-operand (content keyword-t) (location source-location-t))
  (int-operand (content int-t) (location source-location-t))
  (float-operand (content float-t) (location source-location-t))
  (var-operand (name string-t) (location source-location-t)))

;; projects/meta-lisp.meta/src/stack/instr.meta
(define-struct stack-instr-t
  (op string-t)
  (operands (list-t stack-operand-t))
  (location source-location-t))

;; projects/meta-lisp.meta/src/stack/index.meta
(module meta)
(import-all ./mod.meta)
(import-all ./definition.meta)
(import-all ./operand.meta)
(import-all ./instr.meta)
```

可以直接在本 pass 文件中定义所需类型，或者创建单独的文件。
