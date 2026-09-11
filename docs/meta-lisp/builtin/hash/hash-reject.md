---
title: hash-reject
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (-> K V bool-t) (hash-t K V)))
```

# Description

Remove entries for which the predicate returns true.

# Examples

```meta-lisp
(hash-reject
  (@hash 'a 1 'b 2 'x -1 'y -2)
  (lambda (k v) (int-non-negative? v)))
;; => (@hash 'x -1 'y -2)
```
