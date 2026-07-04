---
title: int-product
---

# 类型

```meta-lisp
(-> (list-t int-t) int-t)
```

# 描述

求整数列表的积。空列表的积为 1。

# 例子

```meta-lisp
(int-product [1 2 3])    ;; => 6
(int-product [])         ;; => 1
(int-product [2 0 3])    ;; => 0
```
