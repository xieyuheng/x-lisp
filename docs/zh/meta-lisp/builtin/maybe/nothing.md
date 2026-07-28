---
title: nothing
---

# 类型

```meta-lisp
(polymorphic (A) (-> (maybe-t A)))
```

# 描述

`maybe-t` 的构造器，表示缺失的值。

# 例子

```meta-lisp
(let ((m nothing))
  (is-nothing m))  ;; => true
```
