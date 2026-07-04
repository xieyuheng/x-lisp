---
title: make-pair
---

# 类型

```meta-lisp
(polymorphic (A B) (-> A B (pair-t A B)))
```

# 描述

`pair-t` 的构造器，创建一个包含两个值的对。

# 例子

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-first p))   ;; => 1
```
