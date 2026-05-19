# 070-QualifyPass：迁移到 meta-lisp.meta

参考 `prompts/migrate-passes/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/070-QualifyPass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/070-qualify-pass.meta`

## JS 源码

```ts
import { setUnion } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function QualifyPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      qualifyDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "070-qualify")
}

function qualifyDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = qualifyFreeVar(
        definition.mod,
        new Set(definition.parameters),
        definition.body,
      )
      return null
    }

    case "VariableDefinition": {
      definition.body = qualifyFreeVar(
        definition.mod,
        new Set(),
        definition.body,
      )
      return null
    }

    case "TestDefinition": {
      definition.body = qualifyFreeVar(
        definition.mod,
        new Set(),
        definition.body,
      )
      return null
    }

    case "TypeDefinition": {
      definition.body = qualifyFreeVar(
        definition.mod,
        new Set(definition.parameters),
        definition.body,
      )
      return null
    }

    case "AlgebraicTypeDefinition": {
      const boundNames = new Set(definition.typeConstructor.parameters)
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields, location }) => ({
          definition,
          name,
          fields: fields.map(({ name, type, location }) => ({
            name,
            type: qualifyFreeVar(definition.mod, boundNames, type),
            location,
          })),
          location,
        }),
      )

      return null
    }

    case "OpaqueTypeDefinition": {
      const boundNames = new Set(definition.typeConstructor.parameters)
      definition.representationType = qualifyFreeVar(
        definition.mod,
        boundNames,
        definition.representationType,
      )

      definition.interfaceEntries = definition.interfaceEntries.map(
        ({ name, type, location }) => ({
          name,
          type: qualifyFreeVar(definition.mod, boundNames, type),
          location,
        }),
      )

      return null
    }
  }
}

export function qualifyFreeVar(
  mod: M.Mod,
  boundNames: Set<string>,
  exp: M.Exp,
): M.Exp {
  switch (exp.kind) {
    case "Var": {
      if (boundNames.has(exp.name)) {
        return exp
      }

      return M.QualifiedVar(mod.name, exp.name, exp.location)
    }

    case "Lambda": {
      return M.Lambda(
        exp.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(exp.parameters)),
          exp.body,
        ),
        exp.location,
      )
    }

    case "Polymorphic": {
      return M.Polymorphic(
        exp.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(exp.parameters)),
          exp.body,
        ),
        exp.location,
      )
    }

    case "Let1": {
      return M.Let1(
        exp.name,
        qualifyFreeVar(mod, boundNames, exp.rhs),
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set([exp.name])),
          exp.body,
        ),
        exp.location,
      )
    }

    default: {
      return M.expTraverse(
        (child) => qualifyFreeVar(mod, boundNames, child),
        exp,
      )
    }
  }
}
```

## 提示

- 此 pass 的核心是 `qualify-free-var` 函数：把未绑定的 `var-exp` 替换为 `qualified-var-exp`
- `(function-definition-parameters def)`、`(function-definition-body def)` 等访问 definition 的字段
- `set-union` 用于合并 set，`(set-union a b)` 在 meta 中可用
- `make-qualified-var` 构造 `qualified-var-exp` 节点
- `exp-traverse` 在 `exp-traverse.meta` 中
- `mod-name` 获取 mod 的 name
- `data-constructor-fields` 返回 list of `data-field-t`
- 查阅 `docs/zh/reference/builtin/index.md` 确认 set/hash 操作函数
- 查阅 `docs/zh/reference/syntax.md` 确认 match 语法
