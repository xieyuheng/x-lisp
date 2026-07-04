---
title: pair-first
---

# 类型

```meta-lisp
(polymorphic (A B) (-> (pair-t A B) A))
```

# 描述

取 pair 的第一个元素。

# 例子

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-first p))  ;; => 1
```
