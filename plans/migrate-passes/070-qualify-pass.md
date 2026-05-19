# 070-QualifyPass.ts → 070-qualify-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/070-QualifyPass.ts`（160 行）
**作用**: 将模块内的非限定变量引用（不带 module 前缀的 name）加上正确的 module 前缀，生成 qualified-var-exp。
**流水线集成**: 迁移完成后，编辑 `check-pipeline.meta`，在 `lower-match-pass` 调用后添加 `(qualify-pass project options)`

> 通用指导见 `common.md`。

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历每个 mod，对其 definition bodies 中的 `var-exp` 进行 qualify
- qualify 逻辑:
  - 如果变量名在 boundNames 中（函数参数、let 绑定、polymorphic 参数）→ 保持 `var-exp`
  - 如果变量名不在 boundNames 中 → 替换为 `(qualified-var-exp mod-name var-name location)`
- 对 `lambda-exp` 和 `polymorphic-exp`，将参数加入 boundNames 再处理 body
- 对 `let1-exp`，先处理 rhs（旧 boundNames），再将 name 加入 boundNames 处理 body
- 对 `algebraic-type-definition` 和 `opaque-type-definition`，也需要 qualify type expressions
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `(project-dump-mods project "070-qualify")`
- 返回 `void-t`

## 提示

- 核心函数是 `qualify-free-var`，内部递归处理 exp
- `(function-definition-parameters def)`、`(function-definition-body def)` 等由 define-enum 自动生成
- `set-union` 用于将 bound names 合并
- `make-qualified-var` 构造 `qualified-var-exp` 节点（更常用的是直接用 `qualified-var-exp` variant constructor）
- `mod-name` 获取 mod 的 name（symbol）

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
