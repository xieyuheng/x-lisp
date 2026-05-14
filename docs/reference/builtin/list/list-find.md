---
title: list-find
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) (maybe-t A)))
```

# 描述

查找列表中第一个满足条件的元素，返回 `(just value)` 或 `(nothing)`。派生函数。

# 例子

```scheme
(list-find int? ['a 'b 3 'd])  ;; => (just 3)
(list-find int? ['a 'b 'c])    ;; => (nothing)
```
