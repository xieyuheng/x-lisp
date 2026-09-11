---
title: hash-select-key
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (-> K bool-t) (hash-t K V)))
```

# Description

Keep entries whose key satisfies the predicate.

# Examples

```meta-lisp
(hash-select-key
  (@hash 1 'a 2 'b -1 'x -2 'y)
  int-non-negative?)
;; => (@hash 1 'a 2 'b)
```
