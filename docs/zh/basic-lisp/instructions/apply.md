---
title: apply
---

# 类型

```scheme
(-> value-t T ... R)
```

# 描述

动态调用 `value-t` 中的函数/闭包。`T ...` 为 variadic 参数列表，`R` 为调用结果类型。

# 例子

```scheme
(= result value-t (apply fn arg1 arg2))
```
