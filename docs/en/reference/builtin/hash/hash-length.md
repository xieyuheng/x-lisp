---
title: hash-length
---

# Type

```scheme
(polymorphic (K V) (-> (hash-t K V) int-t))
```

# Description

Number of key-value entries in the hash table.

# Examples

```scheme
(let ((h (@hash "a" 1)))
  (hash-length h))  ;; => 1

(let ((h (@hash "a" 1)))
  (hash-put! "b" 2 h)
  (hash-length h))  ;; => 2
```
