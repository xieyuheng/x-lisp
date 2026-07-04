---
title: nothing?
---

# 类型

```meta-lisp
(polymorphic (A) (-> (maybe-t A) bool-t))
```

# 描述

判断 `maybe-t` 值是否为 `nothing`。

# 例子

```meta-lisp
(nothing? nothing)    ;; => true
(nothing? (just 42))  ;; => false
```
