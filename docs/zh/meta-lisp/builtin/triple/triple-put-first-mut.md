---
title: triple-put-first!
---

# 类型

```meta-lisp
(polymorphic (A B C) (-> A (triple-t A B C) (triple-t A B C)))
```

# 描述

替换 triple 的第一个元素。

# 例子

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-put-first! 7 t)
  (triple-first t))  ;; => 7
```
