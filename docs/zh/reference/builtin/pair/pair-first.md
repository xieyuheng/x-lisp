---
title: pair-first
---

# 类型

```scheme
(polymorphic (A B) (-> (pair-t A B) A))
```

# 描述

取 pair 的第一个元素。

# 例子

```scheme
(let ((p (make-pair 1 "hello")))
  (pair-first p))  ;; => 1
```
