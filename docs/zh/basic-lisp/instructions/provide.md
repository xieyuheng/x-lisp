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
  (= tagged-sum value-t (tag-int sum))
  (= ∅.1 void-t (provide tagged-sum :use-site result))
  (= ∅.2 void-t (goto :label merge)))

(block else
  (= tagged-diff value-t (tag-int diff))
  (= ∅.3 void-t (provide tagged-diff :use-site result))
  (= ∅.4 void-t (goto :label merge)))

(block merge
  (= result value-t (use))
  (= ∅.5 void-t (return result)))
```
