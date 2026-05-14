---
title: pair-second
---

# 类型

```scheme
(polymorphic (A B) (-> (pair-t A B) B))
```

# 描述

取 pair 的第二个元素。

# 例子

```scheme
(pair-second (make-pair 1 "hello"))  ;; => "hello"
```
