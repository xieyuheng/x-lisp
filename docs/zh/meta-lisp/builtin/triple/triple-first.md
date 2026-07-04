---
title: triple-first
---

# 类型

```meta-lisp
(polymorphic (A B C) (-> (triple-t A B C) A))
```

# 描述

取 triple 的第一个元素。

# 例子

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-first t))  ;; => 1
```
