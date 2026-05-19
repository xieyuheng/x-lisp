# 060-LowerMatchPass.ts → 060-lower-match-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/060-LowerMatchPass.ts`（305 行）
**作用**: 将 `match` 表达式降级为嵌套的 `if`/`cond` 表达式。这是 match 模式匹配的核心实现。
**流水线集成**: 迁移完成后，编辑 `check-pipeline.meta`，在 `claim-pass` 调用后添加 `(lower-match-pass project options)`

> 通用指导见 `common.md`。

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历 `(project-mods project)`，对每个 mod 的每个 definition 中的表达式递归做 lower-match
- 降级逻辑：
  - 对 `match-exp` 提取 targets 和 clauses，递归处理嵌套 match
  - 对每个 clause 按 pattern 类型分发（variable pattern、data pattern）
  - 对 data pattern：按 data constructor 分组、生成 field accessor 调用、构造条件表达式
  - pattern guard 需要在条件中处理
  - 嵌套 match targets 递归处理
- **依赖**: 需要 `desugar` 和 `create-desugar-state` 函数（参考 `020-desugar-pass.meta` 中已实现的同名函数）
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `(project-dump-mods project "060-lower-match")`
- 返回 `void-t`

## 提示

- 模式匹配判断函数: 已实现的是 `var-pattern?` 和 `data-pattern?`（在 `pattern/pattern.meta` 中），不是 `is-var-pattern` / `is-data-pattern`
- `data-pattern` 就是 `apply-exp`，target 为 data constructor（`var-exp` 或 `qualified-var-exp`），args 为子 pattern
- data constructor field 的 accessor 名称模式为 `<constructor-name>-<field-name>`
- data constructor 的 predicate 名称模式为 `<constructor-name>?`
- `exp-free-names`、`exp-occurred-names` 存在于 exp/ 目录
- `exp-traverse` 在 `exp-traverse.meta` 中
- **不存在**的函数(需自行实现或通过其他方式替代):
  - `generate-relative-fresh-name` → 参考 020 中的 `generate-fresh-name`
  - `data-pattern-data-constructor` → 用 `apply-exp-target` 获取
  - `data-pattern-arg-patterns` → 用 `apply-exp-args` 获取
- `make-match-clause` 构造 match clause 节点
- `set-union` 合并 set（多次调用实现多个 set 合并）

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
