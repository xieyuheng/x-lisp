# 130-UnnestOperandPass：迁移到 meta-lisp.meta

参考 `plans/migrate-passes-plan-b/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/130-UnnestOperandPass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/130-unnest-operand-pass.meta`

## JS 源码

```ts
import { arrayUnzip } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function UnnestOperandPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      onDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "130-unnest-operand")
}

type State = {
  freshNameCount: number
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      const state = { freshNameCount: 0 }
      definition.body = onExp(state, definition.body)
      return null
    }
  }
}

function generateFreshName(state: State): string {
  state.freshNameCount++
  return `_.${state.freshNameCount}`
}

function onExp(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Apply": {
      const [targetEntries, newTarget] = forAtom(state, exp.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        exp.args.map((arg) => forAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      return prependLets(
        [...targetEntries, ...argsEntries],
        M.Apply(newTarget, newArgs, exp.location),
      )
    }

    default: {
      return M.expTraverse((e) => onExp(state, e), exp)
    }
  }
}

function prependLets(entries: Array<Entry>, exp: M.Exp): M.Exp {
  if (entries.length === 0) {
    return exp
  }

  const [[name, rhs], ...restEntries] = entries
  if (name === null) {
    return M.Begin1(rhs, prependLets(restEntries, exp), exp.location)
  } else {
    return M.Let1(name, rhs, prependLets(restEntries, exp), exp.location)
  }
}

type Entry = [string | null, M.Exp]

function forAtom(state: State, exp: M.Exp): [Array<Entry>, M.Exp] {
  switch (exp.kind) {
    case "Var":
    case "QualifiedVar":
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return [[], exp]
    }

    case "Apply": {
      const [targetEntries, newTarget] = forAtom(state, exp.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        exp.args.map((arg) => forAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      const freshName = generateFreshName(state)
      const entry: Entry = [
        freshName,
        M.Apply(newTarget, newArgs, exp.location),
      ]
      return [
        [...targetEntries, ...argsEntries, entry],
        M.Var(freshName, exp.location),
      ]
    }

    case "Let1": {
      const rhsEntry: Entry = [exp.name, onExp(state, exp.rhs)]
      const [bodyEntries, newBody] = forAtom(state, exp.body)
      return [[rhsEntry, ...bodyEntries], newBody]
    }

    case "Begin1": {
      const headEntry: Entry = [null, onExp(state, exp.head)]
      const [bodyEntries, newBody] = forAtom(state, exp.body)
      return [[headEntry, ...bodyEntries], newBody]
    }

    default: {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, onExp(state, exp)]
      return [[entry], M.Var(freshName, exp.location)]
    }
  }
}
```

## 提示

- 此 pass 确保 `apply` 的参数都是原子（atom：变量、常量等），非原子被 let 绑定
- 返回两个值可以用 cons pair `(cons entries new-exp)`，也可以用两个独立的 helper
- `null`（用 `'null` 或特殊标记）表示不需要 let 绑定的 entry（`begin1` 的 head）
- 用 hash 或 let 绑定作为 fresh name counter
- `begin1-exp`、`let1-exp` 等构造函数可用
- `apply-exp?`、`apply-exp-target`、`apply-exp-args` 由 `define-enum exp-t` 自动生成
- `exp-traverse` 在 `exp-traverse.meta` 中
- 查阅 `docs/zh/reference/builtin/index.md` 确认函数名
