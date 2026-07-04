---
title: int-sum
---

# 类型

```scheme
(-> (list-t int-t) int-t)
```

# 描述

求整数列表的和。空列表的和为 0。

# 例子

```scheme
(int-sum [1 2 3])   ;; => 6
(int-sum [])        ;; => 0
(int-sum [-1 0 1])  ;; => 0
```
