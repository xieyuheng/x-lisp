---
title: triple-third
---

# 类型

```meta-lisp
(polymorphic (A B C) (-> (triple-t A B C) C))
```

# 描述

取 triple 的第三个元素。

# 例子

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-third t))  ;; => true
```
