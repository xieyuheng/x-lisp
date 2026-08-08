---
title: hash-select-value
---

# Type

```meta-lisp
(all (K V) (-> (-> V bool-t) (hash-t K V) (hash-t K V)))
```

# Description

Keep entries whose value satisfies the predicate.

# Examples

```meta-lisp
(hash-select-value
  int-non-negative?
  (@hash 'a 1 'b 2 'x -1 'y -2))
;; => (@hash 'a 1 'b 2)
```
