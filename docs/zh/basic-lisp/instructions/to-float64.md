---
title: to-float64
---

# 类型

```scheme
(-> value-t float64-t)
```

# 描述

从 `value-t` 解构 float64 值。运行时进行类型检查。

# 例子

```scheme
(= raw (to-float64 tagged))
```
