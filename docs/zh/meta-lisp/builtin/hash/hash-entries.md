---
title: hash-entries
---

# 类型

```scheme
(polymorphic (K V) (-> (hash-t K V) (list-t (hash-entry-t K V))))
```

# 描述

将哈希表的所有条目转换为列表。

# 例子

```scheme
(let ((h (@hash 'a 1 'b 2)))
  (hash-from-entries (hash-entries h)))  ;; => (@hash 'a 1 'b 2)
```
