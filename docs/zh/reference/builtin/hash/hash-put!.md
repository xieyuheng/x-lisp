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
(let ((h (@hash "a" 1)))
  (hash-put! "b" 2 h))
```
