---
title: hash-reject-key
---

# Type

```scheme
(polymorphic (K V) (-> (-> K bool-t) (hash-t K V) (hash-t K V)))
```

# Description

Remove entries whose key satisfies the predicate.

# Examples

```scheme
(hash-reject-key
  int-non-negative?
  (@hash 1 'a 2 'b -1 'x -2 'y))
;; => (@hash -1 'x -2 'y)
```
