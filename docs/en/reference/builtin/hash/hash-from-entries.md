---
title: hash-from-entries
---

# Type

```scheme
(polymorphic (K V) (-> (list-t (hash-entry-t K V)) (hash-t K V)))
```

# Description

Build a hash table from a list of entries.

# Examples

```scheme
(hash-from-entries
  [(make-hash-entry 'a 1)
   (make-hash-entry 'b 2)])
;; => (@hash 'a 1 'b 2)
```
