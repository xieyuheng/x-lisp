---
title: make-pair
---

# 类型

```scheme
(polymorphic (A B) (-> A B (pair-t A B)))
```

# 描述

`pair-t` 的构造器，创建一个包含两个值的对。

# 例子

```scheme
(make-pair 1 "hello")   ;; => (1 . "hello")
(make-pair "a" "b")     ;; => ("a" . "b")
```
