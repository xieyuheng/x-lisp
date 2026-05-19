# 040-ExecutePass.ts → 040-execute-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/040-ExecutePass.ts`（251 行）
**作用**: 将 project.fragments 中的每个 fragment 转换为 module，评估 stmt 并写入 mod 结构中。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `module-pass` 调用后添加 `(execute-pass project options)`

> 通用指导（文档、类型定义、命名映射、验证命令等）见 `common.md`。

## 迁移要点

- 遍历 `(project-fragments project)`，对每个 fragment 调用 `project-lookup-mod`（如已存在）或 `make-new-mod`
- 对每个 stmt 做 `match stmt`，按 kind 分发：
  - `exempt-stmt`, `claim-stmt`, `claim-type-stmt`, `admit-stmt` → 加入 mod.claimed / mod.admitted
  - `declare-primitive-function-stmt`, `declare-primitive-variable-stmt` → 调用 mod-claim
  - `define-function-stmt`, `define-variable-stmt`, `define-test-stmt` → 调用 mod-define
  - `define-type-stmt`, `define-algebraic-type-stmt`, `define-opaque-type-stmt` → 处理 data-constructors
- 评估 prim 声明时使用 `(qualified-var-exp 'builtin 'type-t location)` 获取类型
- 如果 options 中有 `dump`，调用 `(project-dump-mods project "040-execute")`
- 返回 `void-t`

## 提示

- 参考 `010-expand-pass.meta` 中使用 `hash-each` 遍历 fragments 的模式
- 使用 `project-put-mod!`（不是 `project-add-mod`）将 mod 注册到 project
- 使用 `make-new-mod`（不是 `create-mod`）创建新模块
- `list-repeat` 如果尚未定义为全局函数,可在文件末尾自行实现

## 已有数据结构

- `mod-t`: `mod-name`, `mod-stmts`, `mod-admitted`, `mod-claimed`, `mod-definitions`, `mod-data-constructors`
- `project-t`: `project-fragments`, `project-mods`, `project-lookup-mod`
- `definition-t` 的各种 variant: `function-definition`, `variable-definition`, `primitive-function-declaration` 等

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
