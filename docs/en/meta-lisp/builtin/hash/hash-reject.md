---
title: hash-reject
---

# Type

```meta-lisp
(polymorphic (K V) (-> (-> K V bool-t) (hash-t K V) (hash-t K V)))
```

# Description

Remove entries for which the predicate returns true.

# Examples

```meta-lisp
(hash-reject
  (lambda (k v) (int-non-negative? v))
  (@hash 'a 1 'b 2 'x -1 'y -2))
;; => (@hash 'x -1 'y -2)
```
