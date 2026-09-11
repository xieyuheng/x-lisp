---
title: hash-select-value
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (-> V bool-t) (hash-t K V)))
```

# Description

Keep entries whose value satisfies the predicate.

# Examples

```meta-lisp
(hash-select-value
  (@hash 'a 1 'b 2 'x -1 'y -2)
  int-non-negative?)
;; => (@hash 'a 1 'b 2)
```
