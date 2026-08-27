---
title: hash-append
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (hash-t K V) (hash-t K V)))
```

# Description

Merge two hash tables, with `rest` taking priority on key conflicts.

# Examples

```meta-lisp
(hash-append (@hash 1 2) (@hash 3 4))
;; => (@hash 1 2 3 4)

(hash-append (@hash 1 2 3 5) (@hash 3 4))
;; => (@hash 1 2 3 4)
```
