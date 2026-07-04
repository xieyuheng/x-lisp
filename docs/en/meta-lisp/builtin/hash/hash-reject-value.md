---
title: hash-reject-value
---

# Type

```scheme
(polymorphic (K V) (-> (-> V bool-t) (hash-t K V) (hash-t K V)))
```

# Description

Remove entries whose value satisfies the predicate.

# Examples

```scheme
(hash-reject-value
  int-non-negative?
  (@hash 'a 1 'b 2 'x -1 'y -2))
;; => (@hash 'x -1 'y -2)
```
