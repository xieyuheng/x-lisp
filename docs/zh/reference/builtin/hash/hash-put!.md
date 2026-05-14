---
title: hash-put!
---

# 类型

```scheme
(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))
```

# 描述

设置键值对，同 `hash-put`。

# 例子

```scheme
(hash-put! "c" 3 (@hash "a" 1 "b" 2))
```
