---
title: random-int
---

# 类型

```scheme
(-> int-t int-t int-t)
```

# 描述

在 [min, max) 范围内生成随机整数。

# 例子

```scheme
(random-int 1 10)   ;; => 1 到 9 之间的随机整数
(random-int 0 100)  ;; => 0 到 99 之间的随机整数
```
