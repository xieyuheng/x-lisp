---
title: just
---

# 类型

```meta-lisp
(polymorphic (A) (-> A (maybe-t A)))
```

# 描述

`maybe-t` 的构造器，表示一个存在的值。

# 例子

```meta-lisp
(let ((m (just 42)))
  (is-just m))       ;; => true
```
