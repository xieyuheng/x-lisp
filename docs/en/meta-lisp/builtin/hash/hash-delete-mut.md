---
title: hash-delete!
---

# Type

```meta-lisp
(polymorphic (K V) (-> K (hash-t K V) (hash-t K V)))
```

# Description

Delete a key-value pair. Mutates the hash table in place.

# Examples

```meta-lisp
(let ((h (@hash "a" 1 "b" 2 "c" 3)))
  (hash-delete! "a" h)
  h)
;; => (@hash "b" 2 "c" 3)
```
