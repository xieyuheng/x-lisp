---
title: pair-put-first
---

# 类型

```meta-lisp
(polymorphic (A B) (-> A (pair-t A B) (pair-t A B)))
```

# 描述

替换 pair 的第一个元素。

# 例子

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-put-first 7 p)
  (pair-first p))  ;; => 7
```
