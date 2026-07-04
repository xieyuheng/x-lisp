---
title: hash-from-entries
---

# Type

```meta-lisp
(polymorphic (K V) (-> (list-t (hash-entry-t K V)) (hash-t K V)))
```

# Description

Build a hash table from a list of entries.

# Examples

```meta-lisp
(hash-from-entries
  [(make-hash-entry 'a 1)
   (make-hash-entry 'b 2)])
;; => (@hash 'a 1 'b 2)
```
