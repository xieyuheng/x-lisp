---
title: triple-second
---

# 类型

```meta-lisp
(polymorphic (A B C) (-> (triple-t A B C) B))
```

# 描述

取 triple 的第二个元素。

# 例子

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-second t))  ;; => "hello"
```
