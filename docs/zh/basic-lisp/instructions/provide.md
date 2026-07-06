---
title: provide
---

# 类型

```scheme
(-> T void-t :use-site <symbol>)
```

# 描述

向合并点写入值。`:use-site` 标识目标合并点。

合并点的类型由目标 `(use)` 指令的结果类型声明，`provide` operand 的类型由 SSA 定义点确定。

# 例子

```scheme
(block then
  (= tagged-sum (tag-int sum))
  (= ∅.1 (provide tagged-sum :use-site result))
  (= ∅.2 (goto :label merge)))

(block else
  (= tagged-diff (tag-int diff))
  (= ∅.3 (provide tagged-diff :use-site result))
  (= ∅.4 (goto :label merge)))

(block merge
  (= result (use))
  (= ∅.5 (return result)))
```
