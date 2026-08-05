---
title: hash-entries
---

# 类型

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) (list-t (pair-t K V))))
```

# 描述

将哈希表的所有条目转换为列表。

# 例子

```meta-lisp
(let ((h (@hash 'a 1 'b 2)))
  (make-hash-from-entries (hash-entries h)))  ;; => (@hash 'a 1 'b 2)
```
