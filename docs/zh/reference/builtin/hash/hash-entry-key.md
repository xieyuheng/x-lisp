---
title: hash-entry-key
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-entry-t K V) K))
```

# 描述

获取 entry 的键。

# 例子

```scheme
(= entries (hash-entries (@hash 'a 1 'b 2)))
(list-map hash-entry-key entries)  ;; => ['a 'b]
```
