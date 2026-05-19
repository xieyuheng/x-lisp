# 090-LocatePass：迁移到 meta-lisp.meta

参考 `prompts/migrate-passes/common.md` 中的通用指导（文档、类型定义、验证命令）。

## 任务

把 `projects/meta-lisp.js/src/meta/passes/090-LocatePass.ts` 翻译为等价的 `.meta` 文件。

## 目标文件

`projects/meta-lisp.meta/src/meta/passes/090-locate-pass.meta`

## JS 源码

```ts
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function LocatePass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      locateDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "090-locate")
}

function locateDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "VariableDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "TestDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "TypeDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "AlgebraicTypeDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields, location }) => ({
          definition,
          name,
          fields: fields.map(({ name, type, location }) => ({
            name,
            type: locateSpecialApply(type),
            location,
          })),
          location,
        }),
      )

      return null
    }

    case "OpaqueTypeDefinition": {
      definition.representationType = locateSpecialApply(
        definition.representationType,
      )

      definition.interfaceEntries = definition.interfaceEntries.map(
        ({ name, type, location }) => ({
          name,
          type: locateSpecialApply(type),
          location,
        }),
      )

      return null
    }
  }
}

function locateSpecialApply(exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Apply": {
      if (matchLocateEntry(exp.target, exp.args)) {
        if (!exp.location) {
          let message = `[locateSpecialApply] expect source location`
          message += `\n  exp: ${M.formatExp(exp)}`
          throw new Error(message)
        }

        return M.Apply(
          targetWithLocation(exp.target),
          [
            ...exp.args.map((e) => locateSpecialApply(e)),
            expFromSourceLocation(exp.location),
          ],
          exp.location,
        )
      } else {
        return M.Apply(
          exp.target,
          exp.args.map((e) => locateSpecialApply(e)),
          exp.location,
        )
      }
    }

    default: {
      return M.expTraverse((child) => locateSpecialApply(child), exp)
    }
  }
}

const locateTable: Array<{
  source: string
  sourceArity: number
  target: string
}> = [
  { source: "error", sourceArity: 1, target: "error-with-location" },
  { source: "assert", sourceArity: 1, target: "assert-with-location" },
  { source: "assert-not", sourceArity: 1, target: "assert-not-with-location" },
  {
    source: "assert-not-equal",
    sourceArity: 2,
    target: "assert-not-equal-with-location",
  },
  {
    source: "assert-equal",
    sourceArity: 2,
    target: "assert-equal-with-location",
  },
  { source: "box-get", sourceArity: 1, target: "box-get-with-location" },
]

function findLocateEntry(name: string): {
  source: string
  sourceArity: number
  target: string
} {
  const entry = locateTable.find((entry) => entry.source === name)
  if (entry === undefined) {
    throw new Error(`[findLocateEntry] unknown source: ${name}`)
  }

  return entry
}

function matchLocateEntry(exp: M.Exp, args: M.Exp[]): boolean {
  if (exp.kind !== "QualifiedVar") return false
  if (exp.modName !== "builtin") return false
  const entry = locateTable.find((entry) => entry.source === exp.name)
  if (entry === undefined) return false
  return args.length === entry.sourceArity
}

function targetWithLocation(exp: M.Exp): M.Exp {
  assert(exp.kind === "QualifiedVar")
  const entry = findLocateEntry(exp.name)
  return M.QualifiedVar(exp.modName, entry.target, exp.location)
}

function expFromSourceLocation(location: S.SourceLocation): M.Exp {
  return M.desugarList(
    [
      M.Symbol("make-source-location", location),
      M.String(location.path, location),
      expFromSpan(location.span, location),
    ],
    location,
  )
}

function expFromSpan(span: S.Span, location: S.SourceLocation): M.Exp {
  return M.desugarList(
    [
      M.Symbol("make-source-span", location),
      expFromPosition(span.start, location),
      expFromPosition(span.end, location),
    ],
    location,
  )
}

function expFromPosition(
  position: S.Position,
  location: S.SourceLocation,
): M.Exp {
  return M.desugarList(
    [
      M.Symbol("make-source-position", location),
      M.Int(BigInt(position.index), location),
      M.Int(BigInt(position.row), location),
      M.Int(BigInt(position.column), location),
    ],
    location,
  )
}
```

## 提示

- `locate-table` 可以用 list of 自定义 struct 或直接用嵌套 list 表示（`[(source "error") (source-arity 1) (target "error-with-location")]` 等）
- `qualified-var-exp?`、`qualified-var-exp-mod-name`、`qualified-var-exp-name` 由 `define-enum exp-t` 自动生成
- `source-location-t` 有 `source-location-path`、`source-location-span` 等字段
- 构造 source location 表达式时，可以直接用 `apply-exp` 调用对应的构造函数，不需要完整的 `desugar-list`
- `exp-traverse` 在 `exp-traverse.meta` 中
- 查阅 `docs/zh/reference/builtin/index.md` 确认可用内置函数
