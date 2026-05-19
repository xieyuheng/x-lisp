# 120-LiftLambdaPass.ts → 120-lift-lambda-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/120-LiftLambdaPass.ts`（92 行）
**作用**: 将匿名 lambda 提升为顶层函数定义。每个 lambda 会生成一个带唯一名字的顶层 function definition，lambda 位置替换为对该函数的 var-ref。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（该文件需新建: `projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`）。

> 通用指导见 `common.md`。

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 递归遍历所有 mod 的 definitions，寻找 `lambda-exp`:
  - 收集所有自由变量（用 `exp-free-names`）作为额外参数
  - 生成唯一函数名（如 `definitionName©λN`，保留 `©λ` 字符）
  - 函数参数 = 自由变量 + lambda 原参数
  - 创建新的 `function-definition`（收集到 lifted 列表中）
  - lambda 位置替换: 若无自由变量 → `var-exp`；若有自由变量 → `apply-exp`（apply 到自由变量）
- 新 definition 可能需要进一步 lift（递归处理 lifted definitions）
- **需要重建** `mod-definitions`，将 lift 出的新 definition 合并回 mod
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `(project-dump-mods project "120-lift-lambda")`
- 返回 `void-t`

## 提示

- `exp-free-names` 在 `exp/exp-free-names.meta` 中
- `set-to-list` 将 set 转为 list（用于 freeNames）
- 用 `hash-values` 拿所有 definition，`list-flat-map` 展开，`list-map` 重新索引
- 函数名包含 `©λ` 字符，需要保留
- 新 definition 用 `function-definition` variant constructor 构造

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
