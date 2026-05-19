# 100-ShrinkPass：迁移到 meta-lisp.meta

参考 `plans/migrate-passes-plan-b/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/100-ShrinkPass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/100-shrink-pass.meta`

## JS 源码

```ts
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function ShrinkPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      onDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "100-shrink")
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
      definition.body = onExp(definition.body)
      return null
    }
  }
}

function onExp(exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "The": {
      return onExp(exp.exp)
    }

    default: {
      return M.expTraverse(onExp, exp)
    }
  }
}
```

## 提示

- 这个 pass 很简单：去掉所有 `the-exp` 节点（类型标注 `(the type exp)`），递归处理子表达式
- `the-exp?`、`the-exp-exp`、`the-exp-type` 由 `define-enum exp-t` 自动生成
- `exp-traverse` 在 `exp-traverse.meta` 中
- 查阅 `docs/zh/reference/builtin/index.md` 确认可用函数
