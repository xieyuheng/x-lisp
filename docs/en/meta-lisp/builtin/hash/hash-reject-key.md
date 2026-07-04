---
title: hash-reject-key
---

# Type

```meta-lisp
(polymorphic (K V) (-> (-> K bool-t) (hash-t K V) (hash-t K V)))
```

# Description

Remove entries whose key satisfies the predicate.

# Examples

```meta-lisp
(hash-reject-key
  int-non-negative?
  (@hash 1 'a 2 'b -1 'x -2 'y))
;; => (@hash -1 'x -2 'y)
```
