---
title: hash-invert
---

# Type

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) (hash-t V K)))
```

# Description

Swap keys and values. If multiple keys map to the same value, the last key wins.

# Examples

```meta-lisp
(hash-invert (@hash 1 2 3 4))        ;; => (@hash 2 1 4 3)
(hash-invert (@hash 'x 1 'y 1 'z 2)) ;; => (@hash 1 'y 2 'z)
```
