---
title: hash-delete!
---

# Type

```scheme
(polymorphic (K V) (-> K (hash-t K V) (hash-t K V)))
```

# Description

Delete a key-value pair. Mutates the hash table in place.

# Examples

```scheme
(let ((h (@hash "a" 1 "b" 2 "c" 3)))
  (hash-delete! "a" h)
  h)
;; => (@hash "b" 2 "c" 3)
```
