---
title: just
---

# 类型

```scheme
(polymorphic (A) (-> A (maybe-t A)))
```

# 描述

`maybe-t` 的构造器，表示一个存在的值。

# 例子

```scheme
(let ((m (just 42)))
  (just? m))       ;; => true
```
