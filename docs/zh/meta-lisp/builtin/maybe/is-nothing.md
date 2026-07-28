---
title: is-nothing
---

# 类型

```meta-lisp
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# 描述

判断 `maybe-t` 值是否为 `nothing`。

# 例子

```meta-lisp
(is-nothing nothing)    ;; => true
(is-nothing (just 42))  ;; => false
```
