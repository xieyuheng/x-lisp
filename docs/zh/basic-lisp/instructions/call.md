---
title: call
---

# 类型

```scheme
(-> pointer-t T ... R)
```

# 描述

静态函数调用。第一个 input 为目标函数地址（`pointer-t`），`T ...` 为 variadic 参数列表，`R` 为调用结果类型。

# 例子

```scheme
(= result (call address a b))
```
