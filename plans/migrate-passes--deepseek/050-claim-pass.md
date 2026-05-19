# 050-ClaimPass.ts → 050-claim-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/050-ClaimPass.ts`（22 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/050-claim-pass.meta`（新建）
**作用**: 遍历所有 module 的 claimed 条目，检查每个 claimed name 是否已在 admitted 或 definitions 中，未定义的报错。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `execute-pass` 调用后添加 `(claim-pass project)`

## 查阅文档

- 语法形式（`match`、`define` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?`、`hash-get` 等）：`docs/zh/reference/builtin/hash/` 目录
- string 操作（`string-concat` 等）：`docs/zh/reference/builtin/string/` 目录
- error 处理：`docs/zh/reference/builtin/error/error.md`
- file I/O（`writeln`）：`docs/zh/reference/builtin/file/` 目录
- maybe 操作：`docs/zh/reference/builtin/maybe/` 目录
- source-location 相关操作：`docs/zh/reference/builtin/sexp/` 目录
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import

## JS 源码（22 行）

```typescript
export function ClaimPass(project: M.Project): void {
  for (const mod of project.mods.values()) {
    for (const [name, entry] of mod.claimed) {
      if (!mod.admitted.has(name) && mod.definitions.get(name) === undefined) {
        let message = `undefined claimed name`
        message += `\n  module: ${mod.name}`
        message += `\n  name: ${name}`

        if (entry.exp.location) {
          writeln(S.sourceLocationReport(entry.exp.location, message))
        } else {
          message += `\n  exp: ${M.formatExp(entry.exp)}`
          writeln(message)
        }
      }
    }
  }
}
```

## 迁移要点

- 仅接受 `project` 参数（无 options），返回 `void-t`
- 遍历 `(project-mods project)` 的每个 mod
- 遍历 `(mod-claimed mod)` — 返回 hash，用 `hash-each` 遍历
- 检查：`name` 不在 `mod-admitted` 且在 `mod-definitions` 中不存在 → 报错
- 错误信息格式与 JS 源码一致（包含 module name, name, 以及 source location 或 exp）
- 使用 `S.sourceLocationReport` 对应的已有函数或内联构造错误信息

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
