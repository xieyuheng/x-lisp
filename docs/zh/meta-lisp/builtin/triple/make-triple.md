---
title: make-triple
---

# 类型

```scheme
(polymorphic (A B C) (-> A B C (triple-t A B C)))
```

# 描述

`triple-t` 的构造器，创建一个包含三个值的组。

# 例子

```scheme
(let ((t (make-triple 1 "hello" #t)))
  (triple-first t))   ;; => 1
```
