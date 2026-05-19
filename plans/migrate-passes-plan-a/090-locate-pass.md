# 090-LocatePass.ts → 090-locate-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/090-LocatePass.ts`（199 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/090-locate-pass.meta`（新建）
**作用**: 定位特殊的 function apply（如对内置函数的调用），将其转换为特殊的 apply exp（如 `primitive-apply-exp`, `tail-apply-exp` 等）。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `check-pass` 调用后添加 `(locate-pass project options)`

## 查阅文档

- 语法形式（`match`、`define`、`let` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- list 操作：`docs/zh/reference/builtin/list/` 目录
- maybe 操作：`docs/zh/reference/builtin/maybe/` 目录
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历每个 mod 的 definition bodies
- 检查每个 `apply-exp` 的 operator：
  - 如果是 qualified var 且指向 builtin prim → 转换为 `primitive-apply-exp`
  - 如果是 tail 位置 → 转换为 `tail-apply-exp`
  - 如果是已知函数 → 转换为 `function-apply-exp`
  - 其他 → 保持为普通 `apply-exp`
- 需要检查 apply 是否在 tail position（递归判断）
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "090-locate"`
- 返回 `void-t`

## 已有数据结构

- primitive 名称列表在 `src/meta/mod/` 相关文件中
- `exp-t` 包含 `primitive-apply-exp`, `tail-apply-exp`, `function-apply-exp` 等 variant

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
