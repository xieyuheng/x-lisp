---
title: make-hash-from-entries
---

# Type

```meta-lisp
(polymorphic (K V) (-> (list-t (pair-t K V)) (hash-t K V)))
```

# Description

Build a hash table from a list of entries.

# Examples

```meta-lisp
(make-hash-from-entries
  [(make-pair 'a 1)
   (make-pair 'b 2)])
;; => (@hash 'a 1 'b 2)
```
