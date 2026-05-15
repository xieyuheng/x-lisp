---
title: hash-entries
---

# Type

```scheme
(polymorphic (K V) (-> (hash-t K V) (list-t (hash-entry-t K V))))
```

# Description

Convert all entries of a hash table to a list.

# Examples

```scheme
(hash-entries (@hash 'a 1 'b 2))
;; => [(make-hash-entry 'a 1) (make-hash-entry 'b 2)]
```
