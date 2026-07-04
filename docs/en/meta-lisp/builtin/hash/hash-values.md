---
title: hash-values
---

# Type

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) (list-t V)))
```

# Description

Get all values of a hash table as a list.

# Examples

```meta-lisp
(let ((values (hash-values (@hash 1 2 3 4))))
  (list-fold-left iadd 0 values))  ;; => 6
```
