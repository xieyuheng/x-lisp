---
title: pair-t
---

# 类型

```meta-lisp
type-t
```

# 描述

序对类型构造器。`(pair-t A B)` 表示一个包含类型 `A` 和 `B` 两个值的序对。它是语言内置类型，运行时表示为长度为 2 的列表。

# 例子

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-first p))   ;; => 1
```
