---
title: list-select
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) (list-t A)))
```

# 描述

筛选列表中满足条件的元素，保留匹配的。派生函数。

# 例子

```scheme
(list-select int? ['a 1 'b 2])       ;; => [1 2]
(list-select int-non-negative? [0 1 -1 2])  ;; => [0 1 2]
```
