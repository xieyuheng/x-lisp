---
title: hash-delete!
---

# Type

```scheme
(polymorphic (K V) (-> K (hash-t K V) (hash-t K V)))
```

# Description

Delete a key-value pair, returning a new hash table.

# Examples

```scheme
(let ((h (@hash "a" 1 "b" 2 "c" 3)))
  (hash-delete! "a" h)
  h)
;; => (@hash "b" 2 "c" 3)
```
