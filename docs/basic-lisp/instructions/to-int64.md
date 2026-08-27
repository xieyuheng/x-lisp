---
title: to-int64
---

# 类型

```scheme
(-> value-t int64-t)
```

# 描述

从 `value-t` 解构 int64 值。运行时进行类型检查。

# 例子

```scheme
(= raw (to-int64 tagged))
```
