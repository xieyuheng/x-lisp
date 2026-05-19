# 110-UniquifyPass：迁移到 meta-lisp.meta

参考 `prompts/migrate-passes/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/110-UniquifyPass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/110-uniquify-pass.meta`

## JS 源码

```ts
import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function UniquifyPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      onDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "110-uniquify")
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
      definition.body = onExp({}, {}, definition.body)
      return null
    }
  }
}

function onExp(
  nameCounts: Record<string, number>,
  nameTable: Record<string, string>,
  exp: M.Exp,
): M.Exp {
  switch (exp.kind) {
    case "Var": {
      const foundName = nameTable[exp.name]
      return foundName ? M.Var(foundName, exp.location) : exp
    }

    case "Lambda": {
      countNames(nameCounts, exp.parameters)
      const parameters = exp.parameters.map((name) =>
        generateNameInCounts(nameCounts, name),
      )
      const newNameTable = {
        ...nameTable,
        ...Object.fromEntries(arrayZip(exp.parameters, parameters)),
      }
      return M.Lambda(
        parameters,
        onExp(nameCounts, newNameTable, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      countName(nameCounts, exp.name)
      const newName = generateNameInCounts(nameCounts, exp.name)
      const newNameTable = { ...nameTable, [exp.name]: newName }
      return M.Let1(
        newName,
        onExp(nameCounts, nameTable, exp.rhs),
        onExp(nameCounts, newNameTable, exp.body),
        exp.location,
      )
    }

    default: {
      return M.expTraverse((e) => onExp(nameCounts, nameTable, e), exp)
    }
  }
}

function countName(nameCounts: Record<string, number>, name: string): void {
  const count = nameCounts[name]
  if (count === undefined) {
    nameCounts[name] = 1
  } else {
    nameCounts[name] = count + 1
  }
}

function countNames(
  nameCounts: Record<string, number>,
  names: Array<string>,
): void {
  for (const name of names) {
    countName(nameCounts, name)
  }
}

function generateNameInCounts(
  nameCounts: Record<string, number>,
  name: string,
): string {
  const count = nameCounts[name]
  if (count === undefined) {
    return name
  } else {
    return `${name}.${count}`
  }
}
```

## 提示

- 用 `make-hash` 模拟 `nameCounts`（hash of symbol -> int）
- 用 `make-hash` 模拟 `nameTable`（hash of symbol -> symbol）
- `hash-get`、`hash-put!`、`hash-has?` 用于操作 hash
- 生成新名称时用 `string-to-symbol` + `string-concat` + `int-to-string`
- `var-exp?`、`var-exp-name`、`lambda-exp?`、`lambda-exp-parameters`、`lambda-exp-body`、`let1-exp?`、`let1-exp-name`、`let1-exp-rhs`、`let1-exp-body` 由 `define-enum exp-t` 自动生成
- `exp-traverse` 在 `exp-traverse.meta` 中
- 注意：在遍历 `let1-exp` 时，先处理 rhs（用旧的 nameTable），再处理 body（用新的 nameTable）
- 查阅 `docs/zh/reference/builtin/index.md` 确认字符串操作函数
