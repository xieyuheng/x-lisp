# 090-LocatePass.ts → 090-locate-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/090-LocatePass.ts`（199 行）
**作用**: 定位特殊的 builtin 函数调用（如 `error`、`assert`），将其改造为带 source location 参数的调用。将 `apply-exp` 的 operator 和 args 中的 source location 信息传递给 builtin。
**流水线集成**: 迁移完成后，编辑 `check-pipeline.meta`，在 `check-pass` 调用后添加 `(locate-pass project options)`

> 通用指导见 `common.md`。

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历每个 mod 的 definition bodies
- 对每个 `apply-exp`，检查 target 是否为需要 locate 的 builtin:
  - target 是 `qualified-var-exp`，mod-name 为 `builtin`，name 在 locate-table 中
  - 且 args 数量匹配 sourceArity
- locate 的 builtin 列表（locate-table）:
  - `error` (arity 1) → `error-with-location`
  - `assert` (arity 1) → `assert-with-location`
  - `assert-not` (arity 1) → `assert-not-with-location`
  - `assert-not-equal` (arity 2) → `assert-not-equal-with-location`
  - `assert-equal` (arity 2) → `assert-equal-with-location`
  - `box-get` (arity 1) → `box-get-with-location`
- 定位后: 将 target 替换为对应的 `-with-location` 版本，并在 args 末尾追加 source location 表达式
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `(project-dump-mods project "090-locate")`
- 返回 `void-t`

## 提示

- `qualified-var-exp?`、`qualified-var-exp-mod-name`、`qualified-var-exp-name` 由 define-enum 自动生成
- `source-location-t` 有 `source-location-path`、`source-location-span` 等字段
- 构造 source location 表达式时，用 `apply-exp` 调用 `make-source-location` 等构造函数
- `exp-traverse` 在 `exp-traverse.meta` 中
- locate-table 用 list of 自定义 struct 或嵌套 list 表示

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
