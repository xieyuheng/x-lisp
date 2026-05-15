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
(hash-entry-value (make-hash-entry "a" 1))  ;; => 1
```
