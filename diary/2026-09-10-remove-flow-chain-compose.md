---
title: 删除 flow/chain/compose 语法关键词
author: deepseek
date: 2026-09-10
---

# 删除 flow/chain/compose 语法关键词

本次删除 `flow`、`chain`、`compose` 三个英文语法关键词，
以及对应的中文语法关键词 `顺流`、`衔接`、`复合`，
并删除它们在两套编译器中的实现、测试、示例和文档。

对应提交：`18e4cae56`。

# 使用频率

删除前，受版本管理的 `.meta` 源码中，
真正把这些名字当语法关键词使用的只有 4 处：

- `flow`：1 处，在 `package-load-fragments.meta` 中。
- `chain`：1 处，在 `030-module-analysis-pass.meta` 中。
- `compose`：2 处，分别在 `030-module-analysis-pass.meta`
  和 `desugar-letrec.meta` 中。

其余出现的地方主要是：

- parser / formatter / pretty / traversal 的实现；
- desugar 实现；
- 测试、示例、文档和生成的 dump。

也就是说，真实调用点只有 4 个，
但为了支持它们，需要在两套编译器里维护三个独立的 AST 变体：

- `FlowExp` / `flow-exp`
- `ChainExp` / `chain-exp`
- `ComposeExp` / `compose-exp`

并让它们在 parse、format、pretty、traverse、substitution、
location、occurred names、desugar 等路径中全部被处理。
维护成本明显高于当前收益。

# 为什么删除

- 它们是纯语法糖，表达能力可以被已有语法覆盖：
  - `flow` 等价于嵌套函数作用；
  - `chain` 等价于 `(lambda (x) (flow x ...))`；
  - `compose` 等价于反方向的 `chain`。
- 删除后只需要迁移 4 处真实调用，迁移成本可接受。
- 自举编译器（`meta-lisp.meta`，WIP）可以少维护三个语法特性。
- 这符合 [`2025-10-08-variadic-function`](./2025-10-08-variadic-function.md)
  中的判断：只因为参数个数可变就定义为语法关键词，太小题大做。
- 也符合 [`2026-08-14-remove-define-struct-star`](./2026-08-14-remove-define-struct-star.md)
  的清理先例：没有足够证据证明特殊形式值得占用语言核心时，应优先删除。

# 迁移方式

4 处真实调用全部改成显式写法：

- `package-load-fragments.meta` 中的 `flow`
  改为直接调用 `list-each`。
- `030-module-analysis-pass.meta` 中的 `compose`
  改为显式 `lambda`。
- `030-module-analysis-pass.meta` 中的 `chain`
  改为显式 `lambda`。
- `desugar-letrec.meta` 中的 `compose`
  改为显式 `lambda`。

普通函数示例 `compose2` 不是语法关键词实现，因此保留。
