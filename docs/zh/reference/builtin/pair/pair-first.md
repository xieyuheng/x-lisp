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
(pair-first (make-pair 1 "hello"))  ;; => 1
```
