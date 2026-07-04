---
title: float-sum
---

# 类型

```scheme
(-> (list-t float-t) float-t)
```

# 描述

求浮点数列表的和。空列表的和为 0.0。

# 例子

```scheme
(float-sum [1.0 2.0 3.0])  ;; => 6.0
(float-sum [])             ;; => 0.0
(float-sum [-1.0 0.0 1.0]) ;; => 0.0
```
