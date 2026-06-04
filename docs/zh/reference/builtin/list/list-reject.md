---
title: list-reject
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) (list-t A)))
```

# 描述

筛选列表中不满足条件的元素，去除匹配的。

# 例子

```scheme
(list-reject int? ['a 1 'b 2])       ;; => ['a 'b]
(list-reject int-non-negative? [0 1 -1 2])  ;; => [-1]
```
