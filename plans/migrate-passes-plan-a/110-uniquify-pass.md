# 110-UniquifyPass.ts → 110-uniquify-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/110-UniquifyPass.ts`（112 行）
**作用**: 给所有局部变量加上唯一后缀，确保没有变量名遮蔽（shadowing）。每个 lambda/let 绑定的变量会被重命名为 `originalName.N`。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（该文件需新建: `projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`）。

> 通用指导见 `common.md`。

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历所有 mod 的 definitions
- 对每个函数体/let body 递归重命名:
  - 维护两个 hash: `nameCounts`（symbol → int，记录每个名字的出现次数）和 `nameTable`（symbol → symbol，原始名 → 新名）
  - `var-exp` 中的变量引用: 在 `nameTable` 中查找，找到则替换，否则保持原样
  - `lambda-exp` 参数: 用计数器生成新名 `name.N`，更新 nameTable
  - `let1-exp`: 先处理 rhs（用旧的 nameTable），再生成新名处理 body（用新的 nameTable）
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `(project-dump-mods project "110-uniquify")`
- 返回 `void-t`

## 提示

- 用 `make-hash` 模拟 nameCounts 和 nameTable
- `hash-get`、`hash-put!`、`hash-has?` 操作 hash
- 生成新名称: `string-to-symbol` + `string-concat` + `symbol-to-string` + `int-to-string`
- 在遍历 `let1-exp` 时，先处理 rhs（用旧的 nameTable），再处理 body（用新的 nameTable）
- 注意防止 body 中同名变量被错误重命名

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
