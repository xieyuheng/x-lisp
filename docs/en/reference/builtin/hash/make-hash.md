---
title: make-hash
---

# Type

```scheme
(polymorphic (K V) (-> (hash-t K V)))
```

# Description

Create an empty hash table.

# Examples

```scheme
(let ((h (make-hash)))
  (hash-put! 'a 1 h)
  h)
;; => (@hash 'a 1)
```
