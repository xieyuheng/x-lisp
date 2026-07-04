---
title: float-product
---

# 类型

```meta-lisp
(-> (list-t float-t) float-t)
```

# 描述

求浮点数列表的积。空列表的积为 1.0。

# 例子

```meta-lisp
(float-product [1.0 2.0 3.0])  ;; => 6.0
(float-product [])             ;; => 1.0
(float-product [2.0 0.0 3.0]) ;; => 0.0
```
