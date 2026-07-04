---
title: make-hash
---

# Type

```meta-lisp
(polymorphic (K V) (-> (hash-t K V)))
```

# Description

Create an empty hash table.

# Examples

```meta-lisp
(let ((h (make-hash)))
  (hash-put! 'a 1 h)
  h)
;; => (@hash 'a 1)
```
