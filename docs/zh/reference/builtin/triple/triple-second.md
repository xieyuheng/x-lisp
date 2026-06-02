---
title: triple-second
---

# 类型

```scheme
(polymorphic (A B C) (-> (triple-t A B C) B))
```

# 描述

取 triple 的第二个元素。

# 例子

```scheme
(let ((t (make-triple 1 "hello" #t)))
  (triple-second t))  ;; => "hello"
```
