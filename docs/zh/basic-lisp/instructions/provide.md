---
title: provide
---

# 类型

```scheme
(-> T void-t :use-site <symbol>)
```

# 描述

向合并点写入值。`:use-site` 标识目标合并点。

合并点的类型由目标 `(use)` 指令的 `:type` 属性声明，`provide` operand 的类型由 SSA 定义点确定。分析 pass 验证 operand 类型与 `use` 的 `:type` 一致。

# 例子

```scheme
(block then
  (= tagged-sum (tag-int sum))
  (provide tagged-sum :use-site result)
  (goto :label merge))

(block else
  (= tagged-diff (tag-int diff))
  (provide tagged-diff :use-site result)
  (goto :label merge))

(block merge
  (= result (use :type value-t))
  (return result))
```
