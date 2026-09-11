---
title: hash-reject-value
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (-> V bool-t) (hash-t K V)))
```

# Description

Remove entries whose value satisfies the predicate.

# Examples

```meta-lisp
(hash-reject-value
  (@hash 'a 1 'b 2 'x -1 'y -2)
  int-non-negative?)
;; => (@hash 'x -1 'y -2)
```
