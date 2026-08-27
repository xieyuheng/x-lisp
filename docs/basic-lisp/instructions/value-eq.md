---
title: value-eq
---

# 类型

```scheme
(-> value-t value-t bool-t)
```

# 描述

value identity 相等，即 tagged 机器字相等（对应 meta-lisp 的 `eq?`）。结构相等 `equal?` 是基于此的库函数。

# 例子

```scheme
(= same (value-eq x y))
```
