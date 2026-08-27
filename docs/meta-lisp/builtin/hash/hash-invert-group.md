---
title: hash-invert-group
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (hash-t V (set-t K))))
```

# Description

Swap keys and values, grouping duplicate values into a set of keys.

# Examples

```meta-lisp
(hash-invert-group (@hash 1 2 3 4 2 2 4 4))
;; => (@hash 2 (@set 1 2) 4 (@set 3 4))
```
