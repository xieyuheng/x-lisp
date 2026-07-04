---
title: to-bool
---

# 类型

```scheme
(-> value-t bool-t)
```

# 描述

从 `value-t` 解构 bool 值。运行时进行类型检查。

# 例子

```scheme
(= raw bool-t (to-bool tagged))
```
