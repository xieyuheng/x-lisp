---
title: just?
---

# 类型

```meta-lisp
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# 描述

判断 `maybe-t` 值是否为 `just`。

# 例子

```meta-lisp
(just? (just 42))  ;; => true
(just? nothing)    ;; => false
```
