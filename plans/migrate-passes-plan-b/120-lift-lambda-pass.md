# 120-LiftLambdaPass：迁移到 meta-lisp.meta

参考 `prompts/migrate-passes/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/120-LiftLambdaPass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/120-lift-lambda-pass.meta`

## JS 源码

```ts
import assert from "node:assert"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function LiftLambdaPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    mod.definitions = new Map(
      mod.definitions
        .values()
        .flatMap((definition) => onDefinition(mod, definition))
        .map((definition) => [definition.name, definition]),
    )
  }

  if (options.dump) projectDumpMods(project, "120-lift-lambda")
}

type State = {
  mod: M.Mod
  lifted: Array<M.Definition>
  definition: M.Definition
}

function onDefinition(
  mod: M.Mod,
  definition: M.Definition,
): Array<M.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return [definition]
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      const lifted: Array<M.Definition> = []
      const state = { mod, lifted, definition }
      definition.body = onExp(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) => onDefinition(mod, definition)),
      ]
    }
  }
}

function onExp(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Lambda": {
      const freeNames = Array.from(M.expFreeNames(new Set(), exp))
      const liftedCount = state.lifted.length + 1
      const newFunctionName = `${state.definition.name}©λ${liftedCount}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.location)
      state.lifted.push(
        M.FunctionDefinition(
          state.mod,
          newFunctionName,
          newParameters,
          exp.body,
          exp.location,
        ),
      )

      const qualifiedFunctionName = `${state.mod.name}/${newFunctionName}`

      if (freeNames.length == 0) {
        return M.Var(qualifiedFunctionName, exp.location)
      } else {
        return M.Apply(
          M.Var(qualifiedFunctionName, exp.location),
          freeNames.map((name) => M.Var(name, exp.location)),
          exp.location,
        )
      }
    }

    default: {
      return M.expTraverse((e) => onExp(state, e), exp)
    }
  }
}
```

## 提示

- 此 pass 将嵌套的 `lambda-exp` 提升为顶层的 `function-definition`
- `exp-free-names` 在 `projects/meta-lisp.meta/src/meta/exp/exp-free-names.meta` 中
- `set-to-list` 将 set 转为 list（用于 freeNames）
- 需要重建 `mod-definitions`：把 lift 出的新 definition 加入
- 用 `hash-values` 拿所有 definition，`list-flat-map` 展开，`list-map` 重新索引
- 函数名包含 `©λ` 字符，需要保留
- `exp-traverse` 在 `exp-traverse.meta` 中
- 新的 definition 要用 `make-function-definition` 构造
- 查阅 `docs/zh/reference/builtin/index.md` 确认可用函数
