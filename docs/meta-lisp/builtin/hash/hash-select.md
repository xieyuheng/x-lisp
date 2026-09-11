---
title: hash-select
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (-> K V bool-t) (hash-t K V)))
```

# Description

Keep entries for which the predicate returns true.

# Examples

```meta-lisp
(hash-select
  (@hash 'a 1 'b 2 'x -1 'y -2)
  (lambda (k v) (int-non-negative? v)))
;; => (@hash 'a 1 'b 2)
```
