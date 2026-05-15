---
title: hash-put-entries!
---

# Type

```scheme
(polymorphic (K V) (-> (list-t (hash-entry-t K V)) (hash-t K V) (hash-t K V)))
```

# Description

Put entries into a hash table, mutating the hash table in place.

# Examples

```scheme
(= h (@hash))
(hash-put-entries!
  [(make-hash-entry 'a 1) (make-hash-entry 'b 2)]
  h)
h  ;; => (@hash 'a 1 'b 2)
```
