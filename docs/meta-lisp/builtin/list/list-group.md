---
title: list-group
---

# Type

```meta-lisp
(all (K V) (-> (-> V K) (list-t V) (hash-t K (list-t V))))
```

# Description

Group list elements by a key function, returning a hash table.

# Examples

```meta-lisp
;; (swap imod 3) flips arguments: (swap imod 3) => (lambda (x) (imod x 3))
(list-group (swap imod 3) [0 1 2 3 4 5])
;; => (@hash 0 [0 3] 1 [1 4] 2 [2 5])
```
