---
title: set-reject
---

# 类型

```scheme
(polymorphic (A) (-> (-> A bool-t) (set-t A) (set-t A)))
```

# 描述

从集合中排除满足条件的元素。派生函数。

# 例子

```scheme
(set-reject int-non-negative? #{-2 -1 0 1 2})  ;; => #{-2 -1}
```
