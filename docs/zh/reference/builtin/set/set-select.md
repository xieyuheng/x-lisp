---
title: set-select
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (set-t A) (set-t A)))
```

# 描述

筛选集合中满足条件的元素。派生函数。

# 例子

```scheme
(set-select int-non-negative? #{-2 -1 0 1 2})  ;; => #{0 1 2}
```
