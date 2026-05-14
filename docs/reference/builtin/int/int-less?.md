---
title: int-less?
---

# 类型

```scheme
(-> int-t int-t bool-t)
```

# 描述

判断第一个整数是否小于第二个。

# 例子

```scheme
(int-less? 1 2)      ;; => true
(int-less? 2 1)      ;; => false
(int-less? 1 1)      ;; => false
```
