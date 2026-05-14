---
title: just?
---

# 类型

```scheme
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# 描述

判断 `maybe-t` 值是否为 `just`。

# 例子

```scheme
(just? (just 42))  ;; => true
(just? nothing)    ;; => false
```
