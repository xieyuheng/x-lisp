---
title: hash-entry-value
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-entry-t K V) V))
```

# 描述

获取 entry 的值。

# 例子

```scheme
(let ((h (@hash 'a 1 'b 2)))
  (list-map hash-entry-value (hash-entries h)))  ;; => [1 2]
```
