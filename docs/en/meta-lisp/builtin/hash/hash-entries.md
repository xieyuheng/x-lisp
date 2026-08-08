---
title: hash-entries
---

# Type

```meta-lisp
(all (K V) (-> (hash-t K V) (list-t (pair-t K V))))
```

# Description

Convert all entries of a hash table to a list.

# Examples

```meta-lisp
(let ((entries (hash-entries (@hash 'a 1 'b 2))))
  (make-hash-from-entries entries))
;; => (@hash 'a 1 'b 2)
```
