---
title: list-group
---

# Type

```meta-lisp
(all (K V) (-> (list-t V) (-> V K) (hash-t K (list-t V))))
```

# Description

Group list elements by a key function, returning a hash table.

# Examples

```meta-lisp
;; (swap imod 3) flips arguments: (swap imod 3) => (lambda (x) (imod x 3))
(list-group (@list 0 1 2 3 4 5) (swap imod 3))
;; => (@hash 0 (@list 0 3) 1 (@list 1 4) 2 (@list 2 5))
```
