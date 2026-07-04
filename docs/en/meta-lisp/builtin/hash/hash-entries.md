---
title: hash-entries
---

# Type

```meta-lisp
(polymorphic (K V) (-> (hash-t K V) (list-t (hash-entry-t K V))))
```

# Description

Convert all entries of a hash table to a list.

# Examples

```meta-lisp
(let ((entries (hash-entries (@hash 'a 1 'b 2))))
  (hash-from-entries entries))
;; => (@hash 'a 1 'b 2)
```
